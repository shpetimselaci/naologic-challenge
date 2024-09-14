type Product = {
  _id: string;
  docId: string;
  fullData: null;
  data: {
    name: string;
    type: string;
    shortDescription: string;
    description: string;
    vendorId: string;
    manufacturerId: string;
    storefrontPriceVisibility: string;
    variants: Variant[];
    options: Option[];
    availability: string;
    isFragile: boolean;
    published: string;
    isTaxable: boolean;
    images: Image[];
    categoryId: string;
  };
  dataPublic: {};
  immutable: boolean;
  deploymentId: string;
  docType: string;
  namespace: string;
  companyId: string;
  status: string;
  info: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    deletedBy: null;
    deletedAt: null;
    dataSource: string;
    companyStatus: string;
    transactionId: string;
    skipEvent: boolean;
    userRequestId: string;
  };
};

type Variant = {
  id: string;
  available: boolean;
  attributes: {
    packaging: string;
    description: string;
  };
  cost: number;
  currency: string;
  depth: null;
  description: string;
  dimensionUom: null;
  height: null;
  width: null;
  manufacturerItemCode: string;
  manufacturerItemId: string;
  packaging: string;
  price: number;
  volume: null;
  volumeUom: null;
  weight: null;
  weightUom: null;
  optionName: string;
  optionsPath: string;
  optionItemsPath: string;
  sku: string;
  active: boolean;
  images: Image[];
  itemCode: string;
};

type Option = {
  id: string;
  name: string;
  dataField: null;
  values: Value[];
};

type Value = {
  id: string;
  name: string;
  value: string;
};

type Image = {
  fileName: string;
  cdnLink: string | null;
  i: number;
  alt: string | null;
};
