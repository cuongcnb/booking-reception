export enum CartType {
    Invoice = 1,
    Order = 2,
    Return = 3
}

export enum OfflineStates {
    Added = 1,
    Modified = 2,
    Unchanged = 0,
    Removed = 3,
    Backup = 4
}

export enum OrderStatus {
    Pending = 0,
    Draft = 1,
    Ongoing = 2,
    Finalized = 3,
    Void = 4
}

export enum InvoiceStatus {
    Issued = 1,
    Void = 2,
    Pending = 3,
    Delivering = 4,
    Failed = 5,
}

export enum RefundStatus {
    Done = 1,
    Void = 2,
    Pending = 3
}

export enum TableState {
    None = 0,
    InUse = 1,
    NotUse = 2
}

export enum DeliveryType {
    Normal = 0,
    Prompt = 1,
    InDay = 2
}

export enum DeliveryStatus {
    Issued = 1,
    Void = 2,
    Pending = 3,
    Delivering = 4,
    Failed = 5
}

export enum PartnerDeliveryType {
    INDIVIDUAL = 0,
    COMPANY = 1
}

export enum PaymentStatus {
    Paid = 0,
    Void = 1
}

export  enum ResultCustomerType {
    Success = 0,
    Error_code = 1,
    Error_contact = 2,
    Error_api = 3
}

export enum ProductType {
    // Combo - đóng gói
    Manufactured = 1,
    // Hàng hóa
    Purchased = 2,
    // Dịch vụ
    Service = 3
}

export enum PrintTypes {
    Order = 1,
    Invoice = 2,
    Refund = 3,
    Payment = 4,
    PurchasePayment = 5,
    NewRefund = 6,
    Transfer = 7,
    PurchaseOrder = 8,
    PurchaseReturn = 9,
    Delivery = 10
}

export enum NotificationStatus {
    Fail = 0,
    New = 1,
    Sent = 2,
    Received = 3,
    Viewed = 4,
    Read = 5,
    Paid = 6
}

export enum KitchenPrintStatus {
    None = 0,
    Error = 1,
    Success = 2
}

export enum ProductGroups {
    Food = 1,
    Drink = 2,
    Other = 3
}

export enum CartHistotyType {
    NotifyKitchen = 0, // Báo bếp
    PayAPartOrder = 1, // Thanh toán 1 phần
    SplitToOrder = 2, // Đơn được tách
    SplitFromOder = 3 // Đơn tách ra
}

export enum ReportType{
    A4  = 0,
    K80 = 1
}
export enum PromotionTypes {
    Invoice = 0,
    Product = 1
}

export enum SalePromotionTypes {
    // Invoice
    InvoiceDiscount = 1,
    InvoiceProductGift = 2,
    InvoiceProductDiscount = 3,
    InvoicePointGift = 4,

    // Product
    ProductDiscount = 5,
    ProductGift = 6,
    ProductPointGift = 7,
    ProductDiscountByQuantity = 8
}

export enum PromotionBirthdayTimeTypes {
    Day = 1,
    Week = 2,
    Month = 3
}

export enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}
export enum CancelDishReasonTypes {
    Template = 1,
    Normal = 2,
    Other = 3,
    System = 4
}
