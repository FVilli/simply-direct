import { Routes } from '@angular/router';
import { UsersCrud } from './users/users.component';
import { SitesCrud } from './sites/sites.component';
import { CompaniesCrud } from './companies/companies.component';
import { VendorsCrud } from './vendors/vendors.component';
import { CategoriesCrud } from './categories/categories.component';
import { AppliancesCrud } from './appliances/appliances.component';
import { DeviceTypesCrud } from './device-types/device-types.component';
import { SensorTypesCrud } from './sensor-types/sensor-types.component';


export default [
    { path: 'users', data: { breadcrumb: 'Users' }, component: UsersCrud },
    { path: 'companies', data: { breadcrumb: 'Companies' }, component: CompaniesCrud },
    { path: 'sites', data: { breadcrumb: 'Sites' }, component: SitesCrud },
    { path: 'vendors', data: { breadcrumb: 'Vendors' }, component: VendorsCrud },
    { path: 'categories', data: { breadcrumb: 'Categories' }, component: CategoriesCrud },
    { path: 'appliances', data: { breadcrumb: 'Appliances' }, component: AppliancesCrud },
    { path: 'device-types', data: { breadcrumb: 'Device Types' }, component: DeviceTypesCrud },
    { path: 'sensor-types', data: { breadcrumb: 'Sensor Types' }, component: SensorTypesCrud },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
