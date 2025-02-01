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
import { AddclientsComponent } from './domains/administrador/pages/clients/addclients/addclients.component';
import { AddusersComponent } from './domains/administrador/pages/users/addusers/addusers.component';
import { AddproductsComponent } from './domains/administrador/pages/inventories/addproducts/addproducts.component';
import { InsumosComponent } from './domains/administrador/pages/insumos/insumos.component';
import { CategoryComponent } from './domains/administrador/pages/category/category.component';
import { AddcategoryComponent } from './domains/administrador/pages/category/addcategory/addcategory.component';
import { AddinsumosComponent } from './domains/administrador/pages/insumos/addinsumos/addinsumos.component';
import { authGuard } from './domains/shared/models/auth/guard/auth.guard';



export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'administrador',
        component: LayoutComponent,
        children: [
            {
                path: 'inventories',
                component: InventoriesComponent
            },
            {
                path: 'clients',
                component: ClientsComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'addclients',
                component: AddclientsComponent
            },
            {
                path: 'addusers',
                component: AddusersComponent
            },
            {
                path: 'addproducts',
                component: AddproductsComponent
            },
            {
                path: 'insumos',
                component: InsumosComponent
            }, 
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'addcategory',
                component: AddcategoryComponent
            },
            {
                path: 'addinsumos',
                component: AddinsumosComponent
            }




        ]
    },
    {
        path: 'vendedor',
        component: LayoutVendedorComponent,
        children: [
            {
                path: 'catalog',
                component: CatalogComponent, canActivate: [authGuard]
            },
            {
                path: 'product/:id',
                component: DetailProductComponent, canActivate: [authGuard]
            },
            {
                path: 'cancellations',
                component: CancellationsComponent, canActivate: [authGuard]
            },
            {
                path: 'orders-history',
                component: OrdersHistoryComponent, canActivate: [authGuard]
            },
            {
                path: 'orders-history/detail-order',
                component: DetailOrderComponent, canActivate: [authGuard]
            },
            {
                path: 'cancellations/detail-cancellation',
                component: DetailCancellationComponent, canActivate: [authGuard]
            },
            {
                path: 'cart',
                component: CartComponent, canActivate: [authGuard]
            },
            {
                path: 'order-register',
                component: OrderComponent, canActivate: [authGuard]
            }
        ]
    },
    {
        path: 'maintence',
        component: MaintenanceComponent
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];
