import { z } from 'zod';
import { ungzip } from 'pako';

// Types
export type BlueprintIdentifier = string;

export type Blueprint = {
  V: number;
  BP: BlueprintIsland | BlueprintBuilding;
};

type BlueprintIsland = {
  $type: 'Island';
  Entries: Array<BlueprintIslandEntry>;
};

type BlueprintIslandEntry = {
  B?: BlueprintBuilding;
};

type BlueprintBuilding = {
  $type: 'Building';
  Entries: Array<BlueprintBuildingEntry>;
};

type BlueprintBuildingEntry = {
  T: string;
};

export type BlueprintSummary = {
  isValid: boolean;
  buildingCount: number;
  islandCount: number;
  cost: number;
};

// Constants
const BLUEPRINT_IDENTIFIER_REGEX = /^SHAPEZ2-\d-.+\$$/;

// Schemas
const BLUEPRINT_SCHEMA = z.object({
  V: z.number(),
  BP: z.object({
    $type: z.enum(['Island', 'Building']),
    Entries: z.array(z.any())
  })
});

// Functions
function isValidBlueprintIdentifier(value: string): boolean {
  return BLUEPRINT_IDENTIFIER_REGEX.test(value);
}


export function decode(blueprintString: BlueprintIdentifier) {
    // Remove the starting "SHAPEZ2-1-" and ending "$"
    const trimmedString = blueprintString.replace(/^SHAPEZ2-1-/, '').replace(/\$$/, '');
    console.log(trimmedString)
    
    // Decode the base64 string
    const decodedData = atob(trimmedString);
    
    // Decompress the data using pako's gzip method
    const gzipedDataArray = Uint8Array.from(decodedData, (c) => c.charCodeAt(0));
	const ungzipedData = ungzip(gzipedDataArray);
	const content = new TextDecoder().decode(ungzipedData);
	return JSON.parse(content);
  }

function isBlueprint(value: unknown): value is Blueprint {
  const validation = BLUEPRINT_SCHEMA.safeParse(value);
  return validation.success;
}

function getBuildingCount(blueprint: Blueprint): number {
  if (blueprint.BP.$type === 'Island') {
    return blueprint.BP.Entries.reduce((count, entry) => {
      return count + (entry.B?.Entries.length ?? 0);
    }, 0);
  }
  return blueprint.BP.Entries.length;
}

function getIslandCount(blueprint: Blueprint): number {
  return blueprint.BP.$type === 'Island' ? blueprint.BP.Entries.length : 0;
}

function getCost(buildingCount: number): number {
  return buildingCount <= 1 ? 0 : Math.ceil(Math.pow(buildingCount - 1, 1.3));
}

function getBuildings(blueprint: Blueprint): Map<string, number> {
  const buildings = new Map<string, number>();

  function addBuilding(entry: BlueprintBuildingEntry) {
    const count = buildings.get(entry.T) ?? 0;
    buildings.set(entry.T, count + 1);
  }

  if (blueprint.BP.$type === 'Island') {
    blueprint.BP.Entries.forEach(island => {
      island.B?.Entries.forEach(addBuilding);
    });
  } else {
    blueprint.BP.Entries.forEach(addBuilding);
  }

  return buildings;
}

export function processBlueprintString(blueprintString: string): BlueprintSummary {
  const summary: BlueprintSummary = {
    isValid: false,
    buildingCount: 0,
    islandCount: 0,
    cost: 0,
  };

  if (!isValidBlueprintIdentifier(blueprintString)) {
    return summary;
  }

  try {
    const decodedBlueprint = decode(blueprintString);
    
    if (!isBlueprint(decodedBlueprint)) {
      return summary;
    }

    summary.isValid = true;
    summary.buildingCount = getBuildingCount(decodedBlueprint);
    summary.islandCount = getIslandCount(decodedBlueprint);
    summary.cost = getCost(summary.buildingCount);

  } catch (error) {
    console.error("Error processing blueprint:", error);
  }

  return summary;
}