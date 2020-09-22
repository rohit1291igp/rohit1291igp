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
            displayName: 'Product Decentralization',
            iconName: 'card_giftcard',
            route: '/new-dashboard/productDecentralization',
        },
        {
            displayName: 'Banner Panel',
            iconName: 'image',
            route: '/new-dashboard/banner',
        }, {
            displayName: 'Ops-Report',
            iconName: 'analytics',
            route: '/new-dashboard/dailywarehouseOpsReport',
        }
    ],

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
        
    ]
}