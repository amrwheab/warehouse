interface Row {
  title: string | undefined;
  path: string | undefined;
}

interface Field {
  id: string | undefined;
  title: string | undefined;
  rows: Row[] | undefined;
}

export interface Footer {
  id: string | undefined;
  field: Field | undefined;
}
