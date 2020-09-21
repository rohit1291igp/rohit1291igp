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
            displayName: 'Dashboard',
            iconName: 'home',
            route: '/new-dashboard',
        },
        {
            displayName: 'Wallet',
            iconName: 'calendar_today',
            route: '/new-dashboard/egv/wallet',
        },
        {
            displayName: 'Statement',
            iconName: 'calendar_today',
            route: '/new-dashboard/egv/statement',
        }
    ]
}