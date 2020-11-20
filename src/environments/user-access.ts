export const userAcess = {
    warehouse: [
        {
            displayName: 'Dashboard',
            iconName: 'home',
            route: '/new-dashboard',
        },
        {
            displayName: 'Send Email Module',
            iconName: 'recent_actors',
            route: 'devfestfl',
            children: [
                {
                    displayName: 'Send Email',
                    iconName: 'attach_email',
                    route: '/new-dashboard/sendemail/sendemail',
                },
                {
                    displayName: 'Excel Upload',
                    iconName: 'attach_email',
                    route: '/new-dashboard/sendemail/uploadtemplate'
                },
                {
                    displayName: 'Order Update',
                    iconName: 'analytics',
                    route: '/new-dashboard/sendemail/orderupdatestatus'
                },
                {
                    displayName: 'Payment Reconciliation',
                    iconName: 'payments',
                    route: '/new-dashboard/sendemail/payment-reconciliation'
                },
                {
                    displayName: 'Address Update',
                    iconName: 'location_on',
                    route: '/new-dashboard/sendemail/addressUpdate'
                }
            ]
        },
        {
            displayName: 'Holiday Calender Management',
            iconName: 'calendar_today',
            route: '/new-dashboard/HolidayCalendarManagement',
        },
        {
            displayName: 'Offer Management',
            iconName: 'local_offer',
            route: '/new-dashboard/offer',
        },
        {
            displayName: 'Product Decentralization',
            iconName: 'card_giftcard',
            route: '/new-dashboard/productDecentralization',
        },
         {
            displayName: 'Ops-Report',
            iconName: 'analytics',
            route: '/new-dashboard/dailywarehouseOpsReport',
        },
        {
            displayName: 'Pending orders',
            iconName: 'analytics',
            route: '/new-dashboard/pending-orders',
        }
    ],
    vendor: [
        {
            displayName: 'Dashboard',
            iconName: 'home',
            route: '/new-dashboard/dashboard',
        },
        {
            displayName: 'Reports',
            iconName: 'recent_actors',
            route: 'devfestfl',
            children: [
                {
                    displayName: 'Order Report',
                    iconName: 'receipt',
                    route: '/new-dashboard/orderReport',
                },
                {
                    displayName: 'Product Report',
                    iconName: 'shop',
                    route: '/new-dashboard/reports/getVendorReport'
                },
                {
                    displayName: 'Pincode Report',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getPincodeReport'
                },
                {
                    displayName: 'Delivery Boy Details',
                    iconName: 'transfer_within_a_station',
                    route: '/new-dashboard/deliveryBoyDetails'
                },
                {
                    displayName: 'Uploaded Image',
                    iconName: 'collections',
                    route: '/new-dashboard/uploaded-image'
                },
                {
                    displayName: 'Stock Component Report',
                    iconName: 'store',
                    route: '/new-dashboard/stockReport'
                },
                {
                    displayName: 'Performance Report',
                    iconName: 'analytics',
                    route: '/new-dashboard/performanceReport'
                }
            ]
        }],
    admin: [
        {
            displayName: 'Dashboard',
            iconName: 'home',
            route: '/new-dashboard/dashboard',
        },
        {
            displayName: 'Payout Dashboard',
            iconName: 'home',
            route: '/new-dashboard/payout-dashboard',
        },
        {
            displayName: 'Reports',
            iconName: 'recent_actors',
            route: 'devfestfl',
            children: [
                {
                    displayName: 'Order Report',
                    iconName: 'receipt',
                    route: '/new-dashboard/orderReport',
                },
                {
                    displayName: 'Product Report',
                    iconName: 'shop',
                    route: '/new-dashboard/reports/getVendorReport'
                },
                {
                    displayName: 'Pincode Report',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getPincodeReport'
                },
                {
                    displayName: 'Payout and Taxes',
                    iconName: 'shop',
                    route: '/new-dashboard/reports/getPayoutAndTaxesReport'
                },
                {
                    displayName: 'Uploaded Image',
                    iconName: 'collections',
                    route: '/new-dashboard/uploaded-image'
                },
                {
                    displayName: 'Stock Component Report',
                    iconName: 'store',
                    route: '/new-dashboard/stockReport'
                },
                {
                    displayName: 'Performance Report',
                    iconName: 'analytics',
                    route: '/new-dashboard/performanceReport'
                },
                {
                    displayName: 'Vendor Details',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getVendorDetails'
                },
                {
                    displayName: 'SLA Reports',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getSlaReport'
                },
                {
                    displayName: 'Barcode',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getBarcodeToComponentReport'
                },
                {
                    displayName: 'Barcode verify',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getbarcodestoverify'
                },
                {
                    displayName: 'Component Report',
                    iconName: 'location_on',
                    route: '/new-dashboard/reports/getComponentReport'
                }
            ]
        }],
    egv_admin: [
        {
            displayName: 'Wallet',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/egv/wallet',
        },
        {
            displayName: 'Statement',
            iconName: 'receipt',
            route: '/new-dashboard/egv/statement',
        },
        {
            displayName: 'User Management',
            iconName: 'supervisor_account',
            route: '/new-dashboard/egv/user-management',
        },
        {
            displayName: 'Alert Management',
            iconName: 'notifications_none',
            route: '/new-dashboard/egv/alert-management',
        },
        {
            displayName: 'Password Reset',
            iconName: 'security',
            route: '/new-dashboard/egv/change-password',
        }

    ],
    manager: [
        {
            displayName: 'Wallet',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/egv/wallet',
        },
        {
            displayName: 'Statement',
            iconName: 'receipt',
            route: '/new-dashboard/egv/statement',
        },
        {
            displayName: 'User Management',
            iconName: 'supervisor_account',
            route: '/new-dashboard/egv/user-management',
        },
        {
            displayName: 'Alert Management',
            iconName: 'notifications_none',
            route: '/new-dashboard/egv/alert-management',
        },
        {
            displayName: 'Password Reset',
            iconName: 'security',
            route: '/new-dashboard/egv/change-password',
        }

    ],
    executive: [
        {
            displayName: 'Wallet',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/egv/wallet',
        },
        {
            displayName: 'Statement',
            iconName: 'receipt',
            route: '/new-dashboard/egv/statement',
        },
        {
            displayName: 'Password Reset',
            iconName: 'security',
            route: '/new-dashboard/egv/change-password',
        }

    ],
    marketing: [
        {
            displayName: 'Banner Panel',
            iconName: 'image',
            route: '/new-dashboard/banner',
        },
        {
            displayName: 'Offer Panel',
            iconName: 'local_offer',
            route: '/new-dashboard/offerpagemanagement',
        }
        
    ],
    mldatascience: [
        {
            displayName: 'Search Ranking',
            iconName: 'image',
            route: '/new-dashboard/searchRanking',
        },
        


    ],

    microsite: [{
        displayName: 'Dashboard',
        iconName: 'home',
        route: '/new-dashboard/dashboard-microsite',
    },

    {
        displayName: 'Current Balance',
        iconName: 'account_balance_wallet',
        route: '/new-dashboard/reports/itcReport',
    }],
    "microsite-zeapl": [{
        displayName: 'Dashboard',
        iconName: 'home',
        route: '/new-dashboard/dashboard-microsite',
    },

    {
        displayName: 'Current Balance',
        iconName: 'account_balance_wallet',
        route: '/new-dashboard/reports/itcReport',
    }]
}