import { Routes } from "@angular/router";
import { AddDataComponent } from "./components/add-data/add-data.component";
import { ShowDataComponent } from "./components/show-data/show-data.component";

export const routes: Routes = [
  { path: "add", component: AddDataComponent },
  { path: "show", component: ShowDataComponent },
  { path: "", redirectTo: "/add", pathMatch: "full" },
  { path: "**", redirectTo: "/add" },
];
