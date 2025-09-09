import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard";
import { CloudComponent } from "./cloud/cloud.component";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: Dashboard,
        children: [
            {
                path: '',
                component: CloudComponent
            }
        ]
    }
]