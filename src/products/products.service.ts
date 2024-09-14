import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as XLSX from 'xlsx';
import * as fs from 'node:fs';
import * as path from 'path';
import * as _ from 'lodash';
import { Product, ProductDocument } from './products.schema';

XLSX.set_fs(fs);

@Injectable()
export class ProductsService {
  constructor(
    @InjectConnection() private connection: Connection,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}
  private readonly logger = new Logger(ProductsService.name);

  private called = false;
  @Cron(CronExpression.EVERY_SECOND)
  async handleCron() {
    // DEBUGGING PURPOSES
    if (!this.called) {
      this.called = true;
    } else {
      // this.logger.log('returned');
      return;
    }

    this.logger.log(`CRON job started at ${new Date().toISOString()}`);

    const buffer = await this.getResource();

    const result = this.processXLSXStream(buffer);

    await this.importProducts(result);
    this.logger.log('IMPORTS TO DATABASE WERE COMPLETED');
    this.logger.log(`CRON job ended at ${new Date().toISOString()}`);
  }

  async getResource() {
    this.logger.log('Getting the file resource');

    const logger = this.logger;
    // can be an fetch API CALL too
    let stream = fs.createReadStream(path.resolve('./images40.xlsx'));
    return new Promise<Buffer>((res) => {
      let buffers = [];
      stream.on('data', function (data) {
        buffers.push(data);
      });
      stream.on('end', function () {
        const buf = Buffer.concat(buffers);
        stream = null;
        buffers = null;
        logger.log('File buffer complete, Resolving...');
        res(buf);
      });
    });
  }

  processXLSXStream(stream: Buffer | Uint8Array) {
    this.logger.log('Started processing xlsx to JSON');
    let workbook = XLSX.read(stream, {
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
    this.logger.log('Loaded from XLSX to JSON');

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
    datas = null;
    this.logger.log('Processing to JSON done');

    return result;
  }
  async importProducts(products: Record<string, Product>): Promise<void> {
    this.logger.log(`Imports started at ${new Date().toISOString()}`);

    const existingProductIds = Object.keys(products);
    const batchSize = 1000;
    const batches = Math.ceil(existingProductIds.length / batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      this.logger.log(`Batch ${i + 1} started at ${new Date().toISOString()}`);

      const end = Math.min((i + 1) * batchSize, existingProductIds.length);
      const batchProductIds = existingProductIds.slice(start, end);
      const batchProducts = batchProductIds.reduce((acc, id) => {
        acc[id] = products[id];
        return acc;
      }, {});

      await this.processProducts(batchProducts);
      this.logger.log(`Batch ${i + 1} ended at ${new Date().toISOString()}`);
    }

    this.logger.log(`Imports ended at ${new Date().toISOString()}`);

    this.logger.log(`Soft deletion started at ${new Date().toISOString()}`);

    await this.markDeletedProducts(existingProductIds);
    this.logger.log(`Soft deletion ended at ${new Date().toISOString()}`);
  }

  async processProducts(products: Record<string, Product>): Promise<void> {
    const session = await this.productModel.startSession();
    try {
      await session.withTransaction(async () => {
        for (const productId in products) {
          await this.upsertProduct(products[productId]);
        }
      });
      await session.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async upsertProduct(product: Product): Promise<ProductDocument> {
    const filter = { _id: product._id };
    const upsertProduct = new this.productModel({
      ...product,
      info: {
        ...product.info,
        updatedAt: new Date().toISOString(),
      },
    });
    const update = {
      $set: upsertProduct,
    };
    const options = { upsert: true, new: true };

    return this.productModel.findOneAndUpdate(filter, update, options);
  }

  async markDeletedProducts(existingProductIds: string[]): Promise<void> {
    const session = await this.productModel.startSession();
    try {
      await session.withTransaction(async () => {
        const products = await this.productModel.find({
          _id: { $nin: existingProductIds },
        });
        for (const product of products) {
          await this.deleteProduct(product._id);
        }
      });
      await session.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(productId, {
      deleted: true,
      'info.deletedAt': new Date().toISOString(),
    });
  }
}
