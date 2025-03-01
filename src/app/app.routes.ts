import { Routes } from '@angular/router';
import { LoginComponent } from './domains/shared/pages/login/login.component';
import { LayoutComponent } from './domains/administrador/components/layout/layout.component';
import { InventoriesComponent } from './domains/administrador/pages/inventories/inventories.component';
import { ClientsComponent } from './domains/administrador/pages/clients/clients.component';

import { CatalogComponent } from './domains/vendedor/pages/catalog/catalog.component';
import { DetailProductComponent } from './domains/vendedor/pages/detail-product/detail-product.component';
import { CancellationsComponent } from './domains/vendedor/pages/cancellations/cancellations.component';
import { OrdersHistoryComponent } from './domains/vendedor/pages/orders-history/orders-history.component';
import { NotFoundComponent } from './domains/shared/pages/not-found/not-found.component';
import { LayoutVendedorComponent } from './domains/vendedor/components/layout-vendedor/layout-vendedor.component';
import { DetailOrderComponent } from './domains/vendedor/pages/orders-history/detail-order/detail-order.component';
import { DetailCancellationComponent } from './domains/vendedor/pages/cancellations/detail-cancellation/detail-cancellation.component';
import { MaintenanceComponent } from './domains/shared/pages/maintenance/maintenance.component';
import { CartComponent } from './domains/vendedor/pages/cart/cart.component';
import { OrderComponent } from './domains/vendedor/pages/orders-history/order/order.component';
import { UsersComponent } from './domains/administrador/pages/users/users.component';
import { AddclientsComponent } from './domains/administrador/pages/clients/addclients/addclients.component';
import { AddusersComponent } from './domains/administrador/pages/users/addusers/addusers.component';
import { InsumosComponent } from './domains/administrador/pages/insumos/insumos.component';
import { CategoryComponent } from './domains/administrador/pages/category/category.component';
import { AddcategoryComponent } from './domains/administrador/pages/category/addcategory/addcategory.component';
import { AddinsumosComponent } from './domains/administrador/pages/insumos/addinsumos/addinsumos.component';
import { CrearProductoComponent } from './domains/administrador/pages/inventories/crear-producto/crear-producto.component';
import { vendedorGuard } from './domains/shared/models/auth/guard/vendedor.guard';
import { administradorGuard } from './domains/shared/models/auth/guard/administrador.guard';
import { InventariosComponent } from './domains/administrador/pages/inventarios/inventarios.component';
import { InventarioDashboardComponent } from './domains/administrador/pages/inventarios/dashboard/dashboard.component';
import { StockInsumosComponent } from './domains/administrador/pages/inventarios/dashboard/pages/stock-insumos/stock-insumos.component';
import { StockProductosComponent } from './domains/administrador/pages/inventarios/dashboard/pages/stock-productos/stock-productos.component';
import { TransferenciasComponent } from './domains/administrador/pages/inventarios/dashboard/pages/transferencias/transferencias.component';
import { TransferenciasFormComponent } from './domains/administrador/pages/inventarios/dashboard/pages/transferencias/form/transferencia-form.component';
import { TransferenciaDetailsComponent } from './domains/administrador/pages/inventarios/dashboard/pages/transferencias/details/details.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'administrador',
        component: LayoutComponent,
        canActivate: [administradorGuard],
        canActivateChild: [administradorGuard],
        children: [
            {
                path: 'inventarios',
                component: InventariosComponent,
            },
            {
                path: 'inventarios/:idInventario',
                component: InventarioDashboardComponent,
                children: [
                    { path: 'insumos', component: StockInsumosComponent },
                    { path: 'productos', component: StockProductosComponent },
                    { path: 'transferencias', component: TransferenciasComponent },
                    { path: 'transferencias/form', component: TransferenciasFormComponent },
                    { path: 'transferencias/:idTransferencia', component: TransferenciaDetailsComponent }
                ]
            },
            {
                path: 'inventories',
                component: InventoriesComponent,
            },
            {
                path: 'inventories/:idProducto',
                component: CrearProductoComponent,
            },
            {
                path: 'clients',
                component: ClientsComponent, 
            },
            {
                path: 'users',
                component: UsersComponent, 
            },
            {
                path: 'addclients',
                component: AddclientsComponent, 
            },
            {
                path: 'addusers',
                component: AddusersComponent, 
            },
            {
                path: 'addproducts',
                component: CrearProductoComponent, 
            },
            {
                path: 'insumos',
                component: InsumosComponent, 
            }, 
            {
                path: 'category',
                component: CategoryComponent, 
            },
            {
                path: 'addcategory',
                component: AddcategoryComponent, 
            },
            {
                path: 'addinsumos',
                component: AddinsumosComponent, 
            }
        ]
    },
    {
        path: 'vendedor',
        component: LayoutVendedorComponent,
        canActivate: [vendedorGuard],
        canActivateChild: [vendedorGuard],
        children: [
            {
                path: 'catalog',
                component: CatalogComponent, 
            },
            {
                path: 'product/:id',
                component: DetailProductComponent, 
            },
            {
                path: 'cancellations',
                component: CancellationsComponent, 
            },
            {
                path: 'orders-history',
                component: OrdersHistoryComponent, 
            },
            {
                path: 'detail-order/:id',
                component: DetailOrderComponent, 
            },
            {
                path: 'detail-cancellation/:id',
                component: DetailCancellationComponent,
            },
            {
                path: 'cart',
                component: CartComponent, 
            },
            {
                path: 'order-register',
                component: OrderComponent, 
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
