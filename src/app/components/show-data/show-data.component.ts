import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DataService } from "../../services/data.service";
import { UserData } from "../../models/user-data.model";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: "app-show-data",
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: "./show-data.component.html",
  styleUrl: "./show-data.component.css",
})
export class ShowDataComponent implements OnInit {
  userData: UserData[] = [];
  filteredData: UserData[] = [];
  loading = false;
  error = "";
  searchText = "";

  editUserId: string | null = null;
  editData: UserData = {} as UserData;

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
  }

  onSearch(): void {
    this.filterData();
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
