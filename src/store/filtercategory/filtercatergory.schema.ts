import { Realm } from '@realm/react';

class FilterCategory extends Realm.Object {
  id!: number;
  name!: string;

  static schema: Realm.ObjectSchema = {
    name: 'FilterCategory',
    properties: {
      id: 'int',
      name: 'string',
    },
    primaryKey: 'id',
  };
}

export default FilterCategory;
