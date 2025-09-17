import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard";
import { CloudComponent } from "./cloud/cloud.component";
import { pathGuard } from "@shared/guards/path.guard";
import { AllComponent } from "./all/all.component";

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
                path: 'all/files',
                component: AllComponent
            },
            {
                path: 'all/folders',
                component: AllComponent
            },
            {
                path: '**',
                component: CloudComponent,
                canActivate: [pathGuard]
            }
        ]
    }
]