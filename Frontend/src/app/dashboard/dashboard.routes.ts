import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard";
import { CloudComponent } from "./cloud/cloud.component";
import { pathGuard } from "@shared/guards/path.guard";

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: Dashboard,
        children: [
            {
                path: '',
                component: CloudComponent
            },
            {
                path: '**',
                component: CloudComponent,
                canActivate: [pathGuard]
            }
        ]
    }
]