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
  dataPublic: object;
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

interface XLSXRow {
  SiteSource: string;
  ItemID: string;
  ManufacturerID: string;
  ManufacturerCode: string;
  ManufacturerName: string;
  ProductID: string;
  ProductName: string;
  ProductDescription: string;
  ManufacturerItemCode: string;
  ItemDescription: string;
  ImageFileName: string;
  ImageURL: string;
  NDCItemCode: string;
  PKG: string;
  UnitPrice: number;
  QuantityOnHand: number;
  PriceDescription: string;
  Availability: string;
  PrimaryCategoryID: string;
  PrimaryCategoryName: string;
  SecondaryCategoryID: string;
  SecondaryCategoryName: string;
  CategoryID: string;
  CategoryName: string;
  IsRX: string;
  IsTBD: string;
}

type XLSXData = XLSXRow[];
