import { DatabaseHelper } from '../types.js';
export class NullableFieldUpdateHelper extends DatabaseHelper {
    updateNullableValue(column, field, existing) {
        const isNullable = field.schema?.is_nullable ?? existing?.is_nullable ?? true;
        if (isNullable) {
            column.nullable();
        }
        else {
            column.notNullable();
        }
    }
}
