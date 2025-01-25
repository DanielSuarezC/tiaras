import { Routes } from '@angular/router';
import { LoginComponent } from './domains/shared/pages/login/login.component';
import { LayoutComponent } from './domains/administrador/components/layout/layout.component';
import { InventoriesComponent } from './domains/administrador/pages/inventories/inventories.component';
import { ClientsComponent } from './domains/administrador/pages/clients/clients.component';

import { CatalogComponent } from './domains/vendedor/pages/catalog/catalog.component';
import { DetailProductComponent } from './domains/vendedor/pages/catalog/detail-product/detail-product.component';
import { CancellationsComponent } from './domains/vendedor/pages/cancellations/cancellations.component';
import { OrdersHistoryComponent } from './domains/vendedor/pages/orders-history/orders-history.component';
import { NotFoundComponent } from './domains/shared/pages/not-found/not-found.component';
import { LayoutVendedorComponent } from './domains/vendedor/components/layout-vendedor/layout-vendedor.component';
import { DetailOrderComponent } from './domains/vendedor/pages/orders-history/detail-order/detail-order.component';
import { DetailCancellationComponent } from './domains/vendedor/pages/cancellations/detail-cancellation/detail-cancellation.component';
import { MaintenanceComponent } from './domains/shared/pages/maintenance/maintenance.component';
import { CartComponent } from './domains/vendedor/pages/catalog/cart/cart.component';
import { OrderComponent } from './domains/vendedor/pages/orders-history/order/order.component';
import { UsersComponent } from './domains/administrador/pages/users/users.component';


export const routes: Routes = [
    {
        path:'',
        component: LoginComponent
    },
    {
        path: 'administrador',
        component: LayoutComponent,
        children:[
            {
                path:'inventories',
                component: InventoriesComponent
            },
            {
                path:'clients',
                component: ClientsComponent
            },
            {
                path:'users',
                component: UsersComponent
            }



            
        ]
    },
    {
        path:'vendedor',
        component: LayoutVendedorComponent,
        children:[
            {
                path:'catalog',
                component: CatalogComponent
            },
            {
                path:'product/:id',
                component: DetailProductComponent
            },
            {
                path:'cancellations',
                component: CancellationsComponent
            },
            {
                path:'orders-history',
                component: OrdersHistoryComponent
            },
            {
                path:'orders-history/detail-order',
                component: DetailOrderComponent    
            },
            {
                path:'cancellations/detail-cancellation',
                component: DetailCancellationComponent
            },
            {
                path:'cart',
                component: CartComponent
            },
            {
                path: 'order-register',
                component: OrderComponent
            }
        ]
    },
    {
        path:'maintence',
        component: MaintenanceComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];
