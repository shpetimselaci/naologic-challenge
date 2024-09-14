import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import * as path from 'path';
import * as _ from 'lodash';

XLSX.set_fs(fs);

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

@Injectable()
export class ProductsService {
  constructor(@InjectConnection() private connection: Connection) {}
  private readonly logger = new Logger(ProductsService.name);

  private called = false;
  @Cron(CronExpression.EVERY_SECOND)
  handleCron() {
    this.logger.debug('Called every second');

    if (!this.called) {
      this.called = true;
    } else {
      this.logger.log('returned');
      return;
    }

    let workbook = XLSX.readFile(path.resolve('./images40.xlsx'), {
      nodim: true,
      dense: true,
      cellText: false,
      cellHTML: false,
      cellFormula: false,
    });

    let worksheet = workbook.Sheets[workbook.SheetNames[0]];

    let datas: XLSXData = XLSX.utils.sheet_to_json(worksheet); // load data

    workbook = null; // clear memory up!
    worksheet = null; // clear memory up!

    const result: Record<string, Product> = {};
    for (let i = 0; i < datas.length; i++) {
      const product = datas[i];
      const productId = product.ProductID;
      let alreadyCreatedProduct = result[productId];
      if (!alreadyCreatedProduct) {
        alreadyCreatedProduct = {
          _id: productId,
          docId: _.uniqueId(),
          fullData: null,
          data: {
            name: '',
            type: 'non-inventory',
            shortDescription: '',
            description: '',
            vendorId: '',
            manufacturerId: '',
            storefrontPriceVisibility: 'members-only',
            variants: [],
            availability: '',
            isFragile: false,
            published: 'published',
            isTaxable: true,
            images: [],
            options: [],
            categoryId: '',
          },
          info: {
            createdBy: 'IkFeiBarPUA3SNc3XiPY8yQl',
            createdAt: '2023-03-27T15:31:11.646Z',
            updatedBy: null,
            updatedAt: null,
            deletedBy: null,
            deletedAt: null,
            dataSource: 'nao',
            companyStatus: 'active',
            transactionId: '0HvDaDwphjaMuupWVEimO',
            skipEvent: false,
            userRequestId: '108621d6-fe38-53b1-5ce7-83b1f58cee78',
          },
          dataPublic: {},
          immutable: false,
          deploymentId: 'd8039',
          docType: 'item',
          namespace: 'items',
          companyId: 'some company id',
          status: 'active',
        };
        result[productId] = alreadyCreatedProduct;
      }

      if (product.ItemDescription) {
        alreadyCreatedProduct.data.name = product.ProductName;
        alreadyCreatedProduct.data.description = product.ProductName;
        alreadyCreatedProduct.data.vendorId = product.ProductName;
        alreadyCreatedProduct.data.manufacturerId = product.ProductName;
        alreadyCreatedProduct.data.availability = product.ProductName;
        alreadyCreatedProduct.data.categoryId = product.ProductName;
      }

      alreadyCreatedProduct.data.variants.push({
        id: product.ItemID,
        available: true,
        attributes: {
          packaging: product.PKG,
          description: product.ItemDescription,
        },
        cost: product.UnitPrice,
        currency: 'USD',
        depth: null,
        description: product.ItemDescription,
        dimensionUom: null,
        height: null,
        width: null,
        manufacturerItemCode: product.ManufacturerItemCode,
        manufacturerItemId: product.ItemID,
        packaging: product.PKG,
        price: product.UnitPrice,
        volume: null,
        volumeUom: null,
        weight: null,
        weightUom: null,
        optionName: `${product.PKG}, ${product.ItemDescription}`,
        optionsPath: 'bhggiv.pctgaf',
        optionItemsPath: 'raaswx.cxuzfe',
        sku: product.NDCItemCode,
        active: true,
        images: [
          {
            fileName: product.ImageFileName,
            cdnLink: product.ImageURL,
            i: 0,
            alt: null,
          },
        ],
        itemCode: product.ManufacturerItemCode,
      });

      result[productId].data.options.push({
        id: _.uniqueId(),
        name: product.ItemDescription ? 'description' : 'packaging',
        dataField: null,
        values: [
          {
            id: _.uniqueId(),
            name: product.ItemDescription
              ? product.ItemDescription
              : product.PKG,
            value: product.ItemDescription
              ? product.ItemDescription
              : product.PKG,
          },
        ],
      });

      datas[i] = null; // release memory
    }
    this.logger.log('Counting', Object.keys(result).length);

    datas = null; // ss
    fs.writeFileSync(path.resolve('./result-i.json'), JSON.stringify(result));

    this.logger.log('DONE');
  }
}
