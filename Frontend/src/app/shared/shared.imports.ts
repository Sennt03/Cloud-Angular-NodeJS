import { LoadingComponent } from "./components/loading/loading.component";
import { ModalComponent } from "./components/modal/modal.component";
import { pathGuard } from "./guards/path.guard";
import { materialImports } from "./material/material.imports";

export const sharedImports = [
    ...materialImports,
    LoadingComponent,
    ModalComponent
]

export {
  ModalComponent,
  LoadingComponent
}; 