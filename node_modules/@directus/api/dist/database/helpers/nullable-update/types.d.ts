import type { Knex } from 'knex';
import { DatabaseHelper } from '../types.js';
import type { Column } from '@directus/schema';
import type { Field, RawField } from '@directus/types';
export declare class NullableFieldUpdateHelper extends DatabaseHelper {
    updateNullableValue(column: Knex.ColumnBuilder, field: RawField | Field, existing: Column): void;
}
