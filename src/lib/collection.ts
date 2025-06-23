export type DublinCoreValue = 
  | string 
  | string[]
  | { lang: string; value: string }[]
  | { lang: string; value: string };

export type DublinCore = {
  creator?: DublinCoreValue;
  title?: DublinCoreValue;
  description?: DublinCoreValue;
  license?: DublinCoreValue;
  publisher?: DublinCoreValue;
  date?: DublinCoreValue;
  type?: DublinCoreValue;
  format?: DublinCoreValue;
  identifier?: DublinCoreValue;
  source?: DublinCoreValue;
  language?: DublinCoreValue;
  relation?: DublinCoreValue;
  coverage?: DublinCoreValue;
  rights?: DublinCoreValue;
  contributor?: DublinCoreValue;
  subject?: DublinCoreValue;
};

export type CollectionData = {
  '@id': string;
  '@type': string;
  dtsVersion: string;
  title: string;
  member: MemberData[];
  description?: string;
  view?: unknown;
  dublinCore?: DublinCore;
};

export type CitationTree = {
  '@type': 'CitationTree';
  citeStructure: unknown[];
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
  citationTrees?: CitationTree[];
  dublinCore?: DublinCore;
};

const replaceDomain = (domain: string, url: string) => {
  if (!url) {
    return '';
  }
  if (url.indexOf('?') != -1) {
    return url.split('?')[0].replace(domain, '') + '?' + url.split('?')[1];
  }
  return url.replace(domain, '') as string;
};

export class Collection {
  static convert(domain: string, data: { [key: string]: unknown }): CollectionData {
    const membersRaw = data.member as { [key: string]: string | number | CitationTree }[];

    const members: MemberData[] = [];

    for (const memberRaw of membersRaw) {
      const member: MemberData = {
        '@id': memberRaw['@id'] as string,
        '@type': memberRaw['@type'] as string,
        title: memberRaw.title as string,
        navigation: replaceDomain(domain, memberRaw['navigation'] as string),
        document: replaceDomain(domain, memberRaw['document'] as string),
        download: replaceDomain(domain, memberRaw['download'] as string),
        totalChildren: (memberRaw['totalChildren'] as number) || 0,
        description: memberRaw['description'] as string,
        citationTrees: memberRaw['citationTrees'] as unknown as CitationTree[],
        dublinCore: memberRaw['dublinCore'] as DublinCore,
      };

      if (memberRaw['totalItems']) {
        member.totalChildren = memberRaw.totalItems as number;
      }

      if (memberRaw['dts:references']) {
        member.navigation = replaceDomain(domain, memberRaw['dts:references'] as string);
      }

      if (memberRaw['dts:passage']) {
        member.document = replaceDomain(domain, memberRaw['dts:passage'] as string);
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
      view: data['view'] as unknown,
      dublinCore: data['dublinCore'] as DublinCore,
    };

    return result;
  }
}
