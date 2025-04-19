import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, RouterOutlet } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { RippleModule } from "primeng/ripple";
import { AppFloatingConfigurator } from "./app/layout/component/app.floatingconfigurator";
import { ProgressBarModule } from "primeng/progressbar";
import { BadgeModule } from "primeng/badge";
import { AvatarModule } from "primeng/avatar";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { TagModule } from "primeng/tag";
import { ChipModule } from "primeng/chip";
import { SkeletonModule } from "primeng/skeleton";
import { AvatarGroupModule } from "primeng/avatargroup";
import { ScrollTopModule } from "primeng/scrolltop";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { StyleClassModule } from "primeng/styleclass";
import { DialogModule } from "primeng/dialog";
import { AppConfigurator } from "./app/layout/component/app.configurator";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { RatingModule } from "primeng/rating";
import { TextareaModule } from "primeng/textarea";
import { SelectModule } from "primeng/select";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { InputIconModule } from "primeng/inputicon";
import { IconFieldModule } from "primeng/iconfield";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { PanelModule } from "primeng/panel";
import { IftaLabelModule } from "primeng/iftalabel";
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from "primeng/message";
import { SelectButtonModule } from "primeng/selectbutton";
import { FormFieldContainer } from "./app/components/forms/field-container.component";
import { FormEntityDetails } from "./app/components/forms/entity-details.component";
import { TableHeader } from "./app/components/table/header.component";
import { TruncatePipe } from "./app/components/pipes";
import { TreeModule } from "primeng/tree";
import { MultiSelectModule } from "primeng/multiselect";

export const NgImports = [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
]

export const PrimeNgImports = [
    ButtonModule, 
    CheckboxModule, 
    InputTextModule, 
    PasswordModule, 
    RippleModule, 
    ProgressBarModule, 
    BadgeModule, 
    AvatarModule, 
    ScrollPanelModule, 
    TagModule, 
    ChipModule, 
    SkeletonModule, 
    AvatarGroupModule, 
    ScrollTopModule, 
    OverlayBadgeModule,
    StyleClassModule,
    DialogModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    PanelModule,
    IftaLabelModule,
    ToggleSwitchModule,
    DatePickerModule,
    MessageModule,
    SelectButtonModule,
    MessageModule,
    TreeModule,
    MultiSelectModule,
]

export const ComponentsImports = [
    AppFloatingConfigurator,
    AppConfigurator,
    FormFieldContainer,
    FormEntityDetails,
    TableHeader,
]

export const PipesImports = [
    TruncatePipe,
]