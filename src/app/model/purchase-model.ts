export class PurchaseModel {

    clientName: string;
    purchaseOrderType: string;
    purchaseOrderNumber: string;
    receivedOn: string;
    receivedFromName: string;
    receivedFromEmail: string;
    purchaseOrderStartDate: any;
    purchaseOrderEndDate: any;
    budget: string;
    currency: string;
    talentDetails: any = [];

    toLocal(data: any) {
        if (!data) {
            return this;
        }

        if (data.clientName) {
            this.clientName = data?.clientName;
        }

        if (data.purchaseOrderType) {
            this.purchaseOrderType = data?.purchaseOrderType;
        }

        if (data.purchaseOrderNumber) {
            this.purchaseOrderNumber = data?.purchaseOrderNumber;
        }

        if (data.receivedOn) {
            this.receivedOn = data?.receivedOn;
        }

        if (data.receivedFromName) {
            this.receivedFromName = data?.receivedFromName;
        }

        if (data.receivedFromEmail) {
            this.receivedFromEmail = data?.receivedFromEmail;
        }

        if (data.purchaseOrderStartDate) {
            this.purchaseOrderStartDate = data?.purchaseOrderStartDate;
        }

        if (data.purchaseOrderEndDate) {
            this.purchaseOrderEndDate = data?.purchaseOrderEndDate;
        }

        if (data.budget) {
            this.budget = data?.budget;
        }

        if (data.currency) {
            this.currency = data?.currency;
        }

        if (data.talentDetails) {
            data.talentDetails.forEach(element => {
                const talentDescription: any = [];
                if (element.jobId && element.talentDescription.length) {
                    element.talentDescription.forEach(item => {
                        if (item.isChecked) {
                            talentDescription.push(item);
                        }
                    })
                    if (talentDescription.length) {
                        element.talentDescription = talentDescription;
                        this.talentDetails.push(element);
                    }
                }
            });
        }

        return this;
    }

}
