import { EmailSignature } from "../models/EmailSignature";
import { Transaction } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export const emailSignatureRepository = {
  async findOne(): Promise<EmailSignature | null> {
    return EmailSignature.findOne();
  },

  async getOrCreate(transaction?: Transaction): Promise<EmailSignature> {
    let signature = await EmailSignature.findOne({ transaction });
    if (!signature) {
      signature = await EmailSignature.create(
        {
          externalId: uuidv4(),
          htmlContent: "",
        },
        { transaction }
      );
    }
    return signature;
  },

  async update(
    id: number,
    htmlContent: string,
    transaction?: Transaction
  ): Promise<void> {
    await EmailSignature.update(
      { htmlContent },
      { where: { id }, transaction }
    );
  },

  async findByExternalId(externalId: string): Promise<EmailSignature | null> {
    return EmailSignature.findOne({ where: { externalId } });
  },
};
