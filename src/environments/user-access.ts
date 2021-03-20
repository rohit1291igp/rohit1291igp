export const userAcess = {
    warehouse: [
        {
            displayName: 'Dashboard',
            iconName: 'home',
            route: '/new-dashboard',
        },
        {
            displayName: 'Holiday Calender Management',
            iconName: 'calendar_today',
            route: '/new-dashboard/warehouse/HolidayCalendarManagement',
        },
        {
            displayName: 'Product Decentralization',
            iconName: 'card_giftcard',
            route: '/new-dashboard/warehouse/productDecentralization',
        },
        {
            displayName: 'Ops-Report',
            iconName: 'analytics',
            route: '/new-dashboard/warehouse/dailywarehouseOpsReport',
        },
        {
            displayName: 'Order Update',
            iconName: 'analytics',
            route: '/new-dashboard/warehouse/orderupdatestatus'
        },
        {
            displayName: 'Payment Reconciliation',
            iconName: 'payments',
            route: '/new-dashboard/warehouse/payment-reconciliation'
        },
        {
            displayName: 'Address Update',
            iconName: 'location_on',
            route: '/new-dashboard/warehouse/addressUpdate'
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
                }
            ]
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
                    route: '/new-dashboard/handels/orderReport',
                },
                {
                    displayName: 'Product Report',
                    iconName: 'shop',
                    route: '/new-dashboard//handels/reports/getVendorReport'
                },
                {
                    displayName: 'Pincode Report',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getPincodeReport'
                },
                {
                    displayName: 'Delivery Boy Details',
                    iconName: 'transfer_within_a_station',
                    route: '/new-dashboard/handels/deliveryBoyDetails'
                },
                {
                    displayName: 'Uploaded Image',
                    iconName: 'collections',
                    route: '/new-dashboard/handels/uploaded-image'
                },
                {
                    displayName: 'Stock Component Report',
                    iconName: 'store',
                    route: '/new-dashboard/handels/stockReport'
                },
                {
                    displayName: 'Performance Report',
                    iconName: 'analytics',
                    route: '/new-dashboard/handels/performanceReport'
                }
            ]
        }, {
            displayName: 'Bulk Upload',
            iconName: 'cloud_upload',
            route: '/new-dashboard/handels/bulkupload',
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
            route: '/new-dashboard/handels/payout-dashboard',
        },
        {
            displayName: 'Reports',
            iconName: 'recent_actors',
            route: 'devfestfl',
            children: [
                {
                    displayName: 'Order Report',
                    iconName: 'receipt',
                    route: '/new-dashboard/handels/orderReport',
                },
                {
                    displayName: 'Product Report',
                    iconName: 'shop',
                    route: '/new-dashboard/handels/reports/getVendorReport'
                },
                {
                    displayName: 'Pincode Report',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getPincodeReport'
                },
                {
                    displayName: 'Payout and Taxes',
                    iconName: 'shop',
                    route: '/new-dashboard/handels/reports/getPayoutAndTaxesReport'
                },
                {
                    displayName: 'Uploaded Image',
                    iconName: 'collections',
                    route: '/new-dashboard/handels/uploaded-image'
                },
                {
                    displayName: 'Stock Component Report',
                    iconName: 'store',
                    route: '/new-dashboard/handels/stockReport'
                },
                {
                    displayName: 'Performance Report',
                    iconName: 'analytics',
                    route: '/new-dashboard/handels/performanceReport'
                },
                {
                    displayName: 'Vendor Details',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getVendorDetails'
                },
                {
                    displayName: 'SLA Reports',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getSlaReport'
                },
                {
                    displayName: 'Barcode',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getBarcodeToComponentReport'
                },
                {
                    displayName: 'Barcode verify',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getbarcodestoverify'
                },
                {
                    displayName: 'Component Report',
                    iconName: 'location_on',
                    route: '/new-dashboard/handels/reports/getComponentReport'
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
    parent_manager: [
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
        },
        {
            displayName: 'Bulk EGV',
            iconName: 'addchart',
            route: '/new-dashboard/egv/bulkegv',
        },
        {
            displayName: 'Voucher Credit/Debit',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/reports/whitelabelReport',
        },
        {
            displayName: 'Email Template',
            iconName: 'email',
            route: '/new-dashboard/egv/email-customization',
        }
    ],
    parent_executive: [
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
        },
        {
            displayName: 'Bulk EGV',
            iconName: 'addchart',
            route: '/new-dashboard/egv/bulkegv',
        },
        {
            displayName: 'Voucher Credit/Debit',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/reports/whitelabelReport',
        },
        {
            displayName: 'Email Template',
            iconName: 'email',
            route: '/new-dashboard/egv/email-customization',
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
        },
        {
            displayName: 'Email Template',
            iconName: 'email',
            route: '/new-dashboard/egv/email-customization',
        }],
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
        },
        {
            displayName: 'Voucher Credit/Debit',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/reports/whitelabelReport',
        },
        {
            displayName: 'Email Template',
            iconName: 'email',
            route: '/new-dashboard/egv/email-customization',
        }

    ],
    marketing: [
        {
            displayName: 'Banner Panel',
            iconName: 'image',
            route: '/new-dashboard/marketing/banner',
        },
        {
            displayName: 'Offer Panel',
            iconName: 'local_offer',
            route: '/new-dashboard/marketing/offerpagemanagement',
        }

    ],
    mldatascience: [
        {
            displayName: 'Search Ranking',
            iconName: 'image',
            route: '/new-dashboard/searchRanking',
        }
    ],

    microsite: [{
        displayName: 'Dashboard',
        iconName: 'home',
        route: '/new-dashboard/dashboard-microsite',
    },

    {
        displayName: 'Current Balance',
        iconName: 'account_balance_wallet',
        route: '/new-dashboard/handels/reports/itcReport',
    },
    {
        displayName: 'Pending orders',
        iconName: 'analytics',
        route: '/new-dashboard/pending-orders',
    }],
    "microsite-zeapl": [{
        displayName: 'Dashboard',
        iconName: 'home',
        route: '/new-dashboard/dashboard-microsite',
    },

    {
        displayName: 'Current Balance',
        iconName: 'account_balance_wallet',
        route: '/new-dashboard/handels/reports/zeaplReport',
    },
    {
        displayName: 'Pending orders',
        iconName: 'analytics',
        route: '/new-dashboard/pending-orders',
    }],
    sub_egv_admin: [
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
        },
        {
            displayName: 'Voucher Credit/Debit',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/reports/whitelabelReport',
        },
        {
            displayName: 'Edit Contact Us',
            iconName: 'contact_page',
            route: '/new-dashboard/egv/contact-us-edit',
        },
        {
            displayName: 'Edit FAQ',
            iconName: 'question_answer',
            route: '/new-dashboard/egv/faq-edit',
        }
    ],
    sub_manager: [
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
        },
        {
            displayName: 'Voucher Credit/Debit',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/reports/whitelabelReport',
        },
        {
            displayName: 'Contact Us',
            iconName: 'contact_page',
            route: '/new-dashboard/egv/contact-us',
        },
        {
            displayName: 'FAQ',
            iconName: 'question_answer',
            route: '/new-dashboard/egv/faq',
        },
        {
            displayName: 'Edit Contact Us',
            iconName: 'contact_page',
            route: '/new-dashboard/egv/contact-us-edit',
        },
        {
            displayName: 'Edit FAQ',
            iconName: 'question_answer',
            route: '/new-dashboard/egv/faq-edit',
        }

    ],
    sub_executive: [
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
        },
        {
            displayName: 'Voucher Credit/Debitboard',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/reports/whitelabelReport',
        }

    ],
    wb_yourigpstore: [
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
        },
        {
            displayName: 'Voucher Credit/Debit',
            iconName: 'account_balance_wallet',
            route: '/new-dashboard/dashboard-microsite',
        },
        {
            displayName: 'Current Balance',
            iconName: 'receipt',
            route: '/new-dashboard/reports/wb-yourigpstore',
        }
    ],
    hdextnp: [
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
    alkem: [
        {
            displayName: 'Upload Doctors',
            iconName: 'home',
            route: '/new-dashboard/alkem-my-doctor',
        }],
    root:[
        {
            displayName: 'upload-excel',
            iconName: 'collections',
            route: '/new-dashboard/sendemail/upload-excel',
        },
        {
            displayName: 'upload-template',
            iconName: 'collections',
            route: '/new-dashboard/sendemail/uploadtemplate',
        }
    
    ]
}