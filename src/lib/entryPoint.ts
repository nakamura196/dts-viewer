export type EntryPointData = {
  '@id': string;
  '@type': string;
  dtsVersion: string;
  collection: string;
  navigation: string;
  document: string;
};

export class EntryPoint {
  static convert(domain: string, data: { [key: string]: string }): EntryPointData {
    const result: EntryPointData = {
      '@id': data['@id'].replace(domain, ''),
      '@type': data['@type'],
      dtsVersion: data['dts:version'],
      collection: (data.collection || '').replace(domain, ''),
      navigation: (data.navigation || '').replace(domain, ''),
      document: (data.document || '').replace(domain, ''),
    };

    if (data.collections) {
      result.collection = data.collections.replace(domain, '');
    }

    if (data.documents) {
      result.document = data.documents.replace(domain, '');
    }

    return result;
  }
}
