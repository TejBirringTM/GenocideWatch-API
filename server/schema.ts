import { ArrayCardinality, UnknownKeysParam, ZodAny, ZodArray, ZodObject, ZodRawShape, ZodTypeAny, ZodUndefined } from "zod";

export type SchemaObj<
    A extends ZodRawShape,
    B extends UnknownKeysParam,
    C extends ZodTypeAny,
    D,
> = ZodObject<A,B,C,D,D>;

export type SchemaArr<A extends ZodTypeAny, B extends ArrayCardinality> = ZodArray<A, B>;
