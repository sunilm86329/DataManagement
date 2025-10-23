import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from "../../services/data.service";
import { UserData } from "../../models/user-data.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-show-data",
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: "./show-data.component.html",
  styleUrl: "./show-data.component.css",
})
export class ShowDataComponent implements OnInit {
  userData: UserData[] = [];
  filteredData: UserData[] = [];
  paginatedData: UserData[] = [];
  loading = false;
  error = "";

  sortColumn = "createdAt";
  sortDirection = "desc";

  searchText = "";
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  editUserId: string | null = null;
  editData: UserData = {} as UserData;
  dialog: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.error = "";

    this.dataService.getData().subscribe({
      next: (data) => {
        this.userData = data;
        this.filterData();
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load data. Please try again later.";
        this.loading = false;
        console.error("Error fetching data:", err);
      },
    });
  }

  filterData(): void {
    if (!this.searchText.trim()) {
      this.filteredData = [...this.userData];
    } else {
      const searchTerm = this.searchText.toLowerCase().trim();
      this.filteredData = this.userData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.email.toLowerCase().includes(searchTerm) ||
          item.occupation.toLowerCase().includes(searchTerm)
      );
    }
    this.sortData();
  }

  sortData(): void {
    const direction = this.sortDirection === "asc" ? 1 : -1;
    this.filteredData.sort((a, b) => {
      let valueA: any = a[this.sortColumn as keyof UserData];
      let valueB: any = b[this.sortColumn as keyof UserData];

      if (this.sortColumn === "age") {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (valueA < valueB) return -1 * direction;
      if (valueA > valueB) return 1 * direction;
      return 0;
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(
      startIndex + this.pageSize,
      this.filteredData.length
    );
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }
    this.sortData();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.filterData();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  getPageRange(): number[] {
    const range: number[] = [];
    const maxVisiblePages = 5;
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) range.push(i);
    } else {
      let start = Math.max(
        1,
        this.currentPage - Math.floor(maxVisiblePages / 2)
      );
      let end = start + maxVisiblePages - 1;
      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      for (let i = start; i <= end; i++) range.push(i);
    }
    return range;
  }

  startEdit(user: UserData): void {
    this.editUserId = user.id!;
    this.editData = { ...user };
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editData = {} as UserData;
  }

  saveEdit(): void {
    if (!this.editUserId) return;

    this.dataService.editData(this.editUserId, this.editData).subscribe({
      next: () => {
        // Update local userData with edited data
        const index = this.userData.findIndex((u) => u.id === this.editUserId);
        if (index !== -1) {
          this.userData[index] = { ...this.editData };
        }
        this.editUserId = null;
        this.filterData();
      },
      error: (err) => {
        this.error = "Failed to update user. Please try again later.";
        console.error("Update error:", err);
      },
    });
  }

  deleteUser(user: UserData): void {
    const confirmed = confirm(`Are you sure you want to delete ${user.name}?`);
    if (confirmed && user.id) {
      this.dataService.deleteData(user.id).subscribe({
        next: () => {
          this.userData = this.userData.filter((u) => u.id !== user.id);
          this.filterData();
        },
        error: (err) => {
          this.error = "Failed to delete user. Please try again later.";
          console.error("Delete error:", err);
        },
      });
    }
  }
}
