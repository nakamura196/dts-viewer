export type NavigationData = {
  '@context': string;
  '@id': string;
  '@type': 'Navigation';
  dtsVersion: string;
  resource: Resource;
  member: ReferenceData[];
};

export type Resource = {
  '@id': string;
  '@type': 'Resource';
  document: string;
  navigation: string;
  citationTrees: [];
};

export type ReferenceData = {
  identifier: string;
  '@type': 'CitableUnit';
  level: number;
  citeType: string;
};

export class Navigation {
  static convert(domain: string, data: { [key: string]: unknown }): NavigationData {
    const rawResource = (data.resource as { [key: string]: unknown }) || {};
    const resource: Resource = {
      '@id': data['@id'] as string,
      '@type': 'Resource' as const,
      document: ((rawResource['document'] as string) || '').replace(domain, ''),
      navigation: ((rawResource['navigation'] as string) || '').replace(domain, ''),
      citationTrees: rawResource['citationTrees'] as [],
    };

    if (data.passage) {
      resource.document = ((data.passage as string) || '').replace(domain, '');
    } else if (data['dts:passage']) {
      resource.document = ((data['dts:passage'] as string) || '').replace(domain, '');
    }

    // members

    const members: ReferenceData[] = [];

    if (data.member) {
      if (!Array.isArray(data.member)) {
        data.member = [data.member];
      }
    }
    // 通常
    const membersRaw = (data.member || []) as {
      [key: string]: string | number;
    }[];

    for (const memberRaw of membersRaw) {
      const member: ReferenceData = {
        identifier: (memberRaw['identifier'] as string) || (memberRaw.ref as string),
        '@type': 'CitableUnit' as const,
        level: memberRaw['level'] as number,
        citeType: memberRaw['citeType'] as string,
      };

      members.push(member);
    }

    // 校異

    const membersRaw2 = (data['hydra:member'] || []) as {
      [key: string]: string | number;
    }[];

    for (const memberRaw of membersRaw2) {
      const member: ReferenceData = {
        identifier: memberRaw['ref'] as string,
        '@type': 'CitableUnit' as const,
        level: data.citeDepth as number,
        citeType: data.citeType as string,
      };

      members.push(member);
    }

    const result: NavigationData = {
      '@context':
        'https://distributed-text-services.github.io/specifications/context/1-alpha1.json',
      '@id': data['@id'] as string,
      '@type': 'Navigation' as const,
      dtsVersion: data['dts:version'] as string,
      member: members,
      resource: resource,
    };

    return result;
  }
}
