import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, ZodUndefined } from "zod";

export type Schema<
    A extends ZodRawShape,
    B extends UnknownKeysParam,
    C extends ZodTypeAny,
    D,
> = ZodObject<A,B,C,D,D>;

// export type OptionalSchema<
//     F extends ZodRawShape,
//     G extends UnknownKeysParam,
//     H extends ZodTypeAny,
//     I,
// > = Schema<F,G,H,I> | ZodUndefined;
