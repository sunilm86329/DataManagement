import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-add-data",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-data.component.html",
  styleUrl: "./add-data.component.css",
})
export class AddDataComponent {
  dataForm: FormGroup;
  submitted = false;
  loading = false;
  successMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    this.dataForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      phone: ["", [Validators.required, Validators.pattern(/^\d{10}$/)]],
      age: ["", [Validators.required, Validators.min(18), Validators.max(120)]],
      occupation: ["", Validators.required],
    });
  }

  get f() {
    return this.dataForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = "";

    if (this.dataForm.invalid) {
      return;
    }

    this.loading = true;

    this.dataService.submitData(this.dataForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = "Data submitted successfully!";
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        console.error("Error submitting data:", error);
        this.successMessage = "";
      },
    });
  }

  resetForm() {
    this.submitted = false;
    this.dataForm.reset();
  }
}
