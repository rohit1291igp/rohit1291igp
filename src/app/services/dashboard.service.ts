import { Injectable } from '@angular/core';

@Injectable()
export class DashboardService {
    
    constructor() { }

    getAlertRow() {
        return {
            "new": true,
            "confirmed": false,
            "future": true,
            "bydate": false
        }
    }

    getMasterData() {
        return {
            displayStatuses: ["New Orders", "Confirmed", "Out for delivery", "Delivered orders"],
            statuses: ["new", "confirmed", "ofd", "delivered"],
            deliveryTimes: ["today", "tomorrow", "future", "bydate", "all"]
        }
    }
    
    getDashboardData() {
        return {
            "new": {
                "today": {
                    ordersCount: 7,
                    displayStr: 'Take action',
                    isAlert: true
                },
                "tomorrow": {
                    ordersCount: 15,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                "future": {
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                "bydate": {
                    ordersCount: 5,
                    displayStr: 'View Orders',
                    isAlert: false
                }
            },
            "confirmed": {
                "today": {
                    ordersCount: 24,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                "tomorrow": {
                    ordersCount: 0,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                "future": {
                    ordersCount: 12,
                    displayStr: 'View Orders',
                    isAlert: false
                },
                "bydate": {
                    ordersCount: 3,
                    displayStr: 'View Orders',
                    isAlert: false
                }
            },
            "ofd": {
                orders: [
                    {
                        orderNumber: 'IG12345671',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    },
                    {
                        orderNumber: 'IG12345672',
                        displayStr: 'Mark as Delivered',
                        isAlert: true
                    },
                    {
                        orderNumber: 'IG12345673',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    },
                    {
                        orderNumber: 'IG12345674',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    },
                    {
                        orderNumber: 'IG12345675',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    },
                    {
                        orderNumber: 'IG12345676',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    },
                    {
                        orderNumber: 'IG12345677',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    },
                    {
                        orderNumber: 'IG12345678',
                        displayStr: 'Mark as Delivered',
                        isAlert: false
                    }
                ]
            },
            "delivered": {
                today: 6,
                total: 10,
                isAlert: false
            }
        };
    }
    
}
