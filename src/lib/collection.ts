export type CollectionData = {
  '@id': string;
  '@type': string;
  dtsVersion: string;
  title: string;
  member: MemberData[];
  description?: string;
};

export type MemberData = {
  '@id': string;
  '@type': string;
  title: string;
  description?: string;
  totalChildren?: number;
  navigation?: string;
  document?: string;
  download?: string;
};

export class Collection {
  static convert(domain: string, data: { [key: string]: unknown }): CollectionData {
    const membersRaw = data.member as { [key: string]: string | number }[];

    const members: MemberData[] = [];

    for (const memberRaw of membersRaw) {
      const member: MemberData = {
        '@id': memberRaw['@id'] as string,
        '@type': memberRaw['@type'] as string,
        title: memberRaw.title as string,
        navigation: ((memberRaw['navigation'] as string) || '').replace(domain, '') as string,
        document: ((memberRaw['document'] as string) || '').replace(domain, '') as string,
        download: ((memberRaw['download'] as string) || '') as string,
        totalChildren: (memberRaw['totalChildren'] as number) || 0,
        description: memberRaw['description'] as string,
      };

      // member.totalChildren = member.totalItems as number;
      // member.totalChildren = ;
      if (memberRaw['totalItems']) {
        member.totalChildren = memberRaw.totalItems as number;
      }

      if (memberRaw['dts:references']) {
        member.navigation = (memberRaw['dts:references'] as string).replace(domain, '') as string;
      }

      if (memberRaw['dts:passage']) {
        member.document = (memberRaw['dts:passage'] as string).replace(domain, '') as string;
      }

      members.push(member);
    }

    const result: CollectionData = {
      '@id': data['@id'] as string,
      '@type': data['@type'] as string,
      dtsVersion: data['dts:version'] as string,
      title: data.title as string,
      description: data.description as string,
      member: members,
    };

    return result;
  }
}
