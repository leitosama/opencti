import { describe, expect, it } from 'vitest';

// basic set
// import stixBundle from '../../data/DATA-TEST-STIX2_v2.json';

// specific data object that are not covered by the basic set, all recorded from real stream events
import stixReports from '../../data/stream-events/stream-event-stix2-reports.json';
import stixIndicators from '../../data/stream-events/stream-event-stix2-indicators.json';
import stixIncidents from '../../data/stream-events/stream-event-stix2-incidents.json';
import stixRfis from '../../data/stream-events/stream-event-stix2-rfis.json';
import stixSightings from '../../data/stream-events/stream-event-stix2-sightings.json';
import stixRelationships from '../../data/stream-events/stream-event-stix2-relationships.json';

import * as testers from '../../../src/utils/stix-filtering/stix-testers';
import type { Filter } from '../../../src/utils/stix-filtering/filter-group';

describe('Stix filter testers', () => {
  describe('by Markings (key=objectMarking)', () => {
    const stixWithMarkings = stixIndicators[0];
    const stixWithoutMarkings = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['objectMarking'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', 'marking-definition--613f2e26-407d-48c7-9eca-b8e91df99dc9']
      };
      expect(testers.testMarkingFilter(stixWithMarkings, filter)).toEqual(true);
      expect(testers.testMarkingFilter(stixWithoutMarkings, filter)).toEqual(false);

      filter = {
        key: ['objectMarking'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>']
      };
      expect(testers.testMarkingFilter(stixWithMarkings, filter)).toEqual(false);
      expect(testers.testMarkingFilter(stixWithoutMarkings, filter)).toEqual(false);
    });
  });

  describe('by Entity Type (key=entity_type)', () => {
    const report = stixReports[0];
    const stixWithExtType = stixIndicators[0];

    it('should test positive for a stix object with matching filter, using generated internal type', () => {
      let filter: Filter = {
        key: ['entity_type'],
        mode: 'or',
        operator: 'eq',
        values: ['Report', 'Note']
      };
      expect(testers.testEntityType(report, filter)).toEqual(true);

      filter = {
        key: ['entity_type'],
        mode: 'and',
        operator: 'eq',
        values: ['Report', 'Note']
      };
      expect(testers.testEntityType(report, filter)).toEqual(false);
    });

    it('should test positive for a stix object with matching filter, using type in extension', () => {
      let filter: Filter = {
        key: ['entity_type'],
        mode: 'and',
        operator: 'eq',
        values: ['Indicator']
      };
      expect(testers.testEntityType(stixWithExtType, filter)).toEqual(true);

      filter = {
        key: ['entity_type'],
        mode: 'or',
        operator: 'eq',
        values: ['Note', 'Report']
      };
      expect(testers.testEntityType(stixWithExtType, filter)).toEqual(false);
    });

    it('should test positive for a stix object with matching filter, using parent types', () => {
      let filter: Filter = {
        key: ['entity_type'],
        mode: 'and',
        operator: 'eq',
        values: ['Stix-Object', 'Stix-Core-Object', 'Stix-Domain-Object', 'Report']
      };
      expect(testers.testEntityType(report, filter)).toEqual(true);

      filter = {
        key: ['entity_type'],
        mode: 'and',
        operator: 'eq',
        values: ['Stix-Object', 'Stix-Cyber-Observable', 'Report']
      };
      expect(testers.testEntityType(report, filter)).toEqual(false);
    });
  });

  describe('by Indicator Types (key=indicator_types)', () => {
    const stixWithIndicatorTypes = stixIndicators[1];
    const stixWithoutIndicatorTypes = stixIndicators[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['indicator_types'],
        mode: 'and',
        operator: 'eq',
        values: ['unknown']
      };
      expect(testers.testIndicatorTypes(stixWithIndicatorTypes, filter)).toEqual(true);
      expect(testers.testIndicatorTypes(stixWithoutIndicatorTypes, filter)).toEqual(false);

      filter = {
        key: ['indicator_types'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>', '<some-other-id>']
      };
      expect(testers.testIndicatorTypes(stixWithIndicatorTypes, filter)).toEqual(false);
      expect(testers.testIndicatorTypes(stixWithoutIndicatorTypes, filter)).toEqual(false);
    });
  });

  describe('by Workflow (key=x_opencti_workflow_id)', () => {
    const reportWithWorkflow = stixReports[0];
    const reportWithoutWorkflow = stixIncidents[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['x_opencti_workflow_id'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', 'bd156107-1f9a-43df-9595-574c467e9e21']
      };
      expect(testers.testWorkflow(reportWithWorkflow, filter)).toEqual(true);
      expect(testers.testWorkflow(reportWithoutWorkflow, filter)).toEqual(false);

      filter = {
        key: ['createdBy'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>', '<some-other-id>']
      };
      expect(testers.testWorkflow(reportWithWorkflow, filter)).toEqual(false);
      expect(testers.testWorkflow(reportWithoutWorkflow, filter)).toEqual(false);
    });
  });

  describe('by CreatedBy (key=createdBy)', () => {
    const stixWithCreatedBy = stixIndicators[0];
    const stixWithoutCreatedBy = stixIncidents[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['createdBy'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', 'identity--4f347cc9-4658-59ee-9707-134f434f9d1c']
      };
      expect(testers.testCreatedBy(stixWithCreatedBy, filter)).toEqual(true);
      expect(testers.testCreatedBy(stixWithoutCreatedBy, filter)).toEqual(false);

      filter = {
        key: ['createdBy'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>', '<some-other-id>']
      };
      expect(testers.testCreatedBy(stixWithCreatedBy, filter)).toEqual(false);
      expect(testers.testCreatedBy(stixWithoutCreatedBy, filter)).toEqual(false);
    });
  });

  describe('by Creator (key=creator)', () => {
    const stixWithCreator = stixIndicators[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['creator'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', '88ec0c6a-13ce-5e39-b486-354fe4a7084f']
      };
      expect(testers.testCreator(stixWithCreator, filter)).toEqual(true);

      filter = {
        key: ['creator'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>', '<some-other-id>']
      };
      expect(testers.testCreator(stixWithCreator, filter)).toEqual(false);
    });
  });

  describe('by Assignee (key=assigneeTo)', () => {
    // no assignee data in DATA-TEST-STIX2_v2.json, here is a local sample
    const stixWithAssignee = stixIncidents[0];
    const stixWithoutAssignee = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['objectAssignee'],
        mode: 'and',
        operator: 'eq',
        values: ['88ec0c6a-13ce-5e39-b486-354fe4a7084f']
      };
      expect(testers.testAssignee(stixWithAssignee, filter)).toEqual(true);
      expect(testers.testIndicatorTypes(stixWithoutAssignee, filter)).toEqual(false);

      filter = {
        key: ['indicator_types'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', '<some-other-id>']
      };
      expect(testers.testIndicatorTypes(stixWithAssignee, filter)).toEqual(false);
      expect(testers.testIndicatorTypes(stixWithoutAssignee, filter)).toEqual(false);
    });
  });

  describe('by Labels (key=labelledBy)', () => {
    const stixWithLabel = stixIncidents[0];
    const stixWithoutLabel = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['labelledBy'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-label>', 'test-label']
      };
      expect(testers.testLabel(stixWithLabel, filter)).toEqual(true);
      expect(testers.testLabel(stixWithoutLabel, filter)).toEqual(false);

      filter = {
        key: ['labelledBy'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-label>', '<some-other-label>']
      };
      expect(testers.testLabel(stixWithLabel, filter)).toEqual(false);
      expect(testers.testLabel(stixWithoutLabel, filter)).toEqual(false);
    });
  });

  describe('by Revoked (key=revoked)', () => {
    const stixWithRevoked = stixIndicators[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['revoked'],
        mode: 'or',
        operator: 'eq',
        values: ['true']
      };
      expect(testers.testRevoked(stixWithRevoked, filter)).toEqual(true);

      filter = {
        key: ['revoked'],
        mode: 'and',
        operator: 'eq',
        values: ['false']
      };
      expect(testers.testRevoked(stixWithRevoked, filter)).toEqual(false);
    });
  });

  describe('by Detection (key=x_opencti_detection)', () => {
    const stixWithDetection = stixIndicators[0];
    const stixWithoutDetection = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['x_opencti_detection'],
        mode: 'or',
        operator: 'eq',
        values: ['true']
      };
      expect(testers.testDetection(stixWithDetection, filter)).toEqual(true);
      expect(testers.testDetection(stixWithoutDetection, filter)).toEqual(false);

      filter = {
        key: ['x_opencti_detection'],
        mode: 'and',
        operator: 'eq',
        values: ['false']
      };
      expect(testers.testDetection(stixWithDetection, filter)).toEqual(false);
      expect(testers.testDetection(stixWithoutDetection, filter)).toEqual(false);
    });
  });

  describe('by Score (key=x_opencti_score)', () => {
    const stixWithScore = stixIndicators[0];
    const stixWithoutScore = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['x_opencti_score'],
        mode: 'or',
        operator: 'lt',
        values: ['75']
      };
      expect(testers.testScore(stixWithScore, filter)).toEqual(true);
      expect(testers.testScore(stixWithoutScore, filter)).toEqual(false);

      filter = {
        key: ['x_opencti_score'],
        mode: 'and',
        operator: 'lt',
        values: ['25']
      };
      expect(testers.testScore(stixWithScore, filter)).toEqual(false);
      expect(testers.testScore(stixWithoutScore, filter)).toEqual(false);
    });
  });

  describe('by Confidence (key=confidence)', () => {
    const stixWithConfidence75 = stixIndicators[0];
    const stixWithConfidence0 = stixIndicators[1];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['confidence'],
        mode: 'or',
        operator: 'gt',
        values: ['50']
      };
      expect(testers.testConfidence(stixWithConfidence75, filter)).toEqual(true);
      expect(testers.testConfidence(stixWithConfidence0, filter)).toEqual(false);

      filter = {
        key: ['confidence'],
        mode: 'and',
        operator: 'lt',
        values: ['50']
      };
      expect(testers.testConfidence(stixWithConfidence75, filter)).toEqual(false);
      expect(testers.testConfidence(stixWithConfidence0, filter)).toEqual(true);
    });
  });

  describe('by Pattern (key=pattern_type)', () => {
    const stixWithPattern = stixIndicators[0];
    const stixWithoutPattern = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['pattern_type'],
        mode: 'or',
        operator: 'eq',
        values: ['stix']
      };
      expect(testers.testPattern(stixWithPattern, filter)).toEqual(true);
      expect(testers.testPattern(stixWithoutPattern, filter)).toEqual(false);

      filter = {
        key: ['pattern_type'],
        mode: 'and',
        operator: 'eq',
        values: ['not-stix']
      };
      expect(testers.testPattern(stixWithPattern, filter)).toEqual(false);
      expect(testers.testPattern(stixWithoutPattern, filter)).toEqual(false);
    });
  });

  describe('by Main Observable Type (key=x_opencti_main_observable_type)', () => {
    const stixWithMOT = stixIndicators[0];
    const stixWithoutMOT = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['x_opencti_main_observable_type'],
        mode: 'or',
        operator: 'eq',
        values: ['Unknown']
      };
      expect(testers.testMainObservableType(stixWithMOT, filter)).toEqual(true);
      expect(testers.testMainObservableType(stixWithoutMOT, filter)).toEqual(false);

      filter = {
        key: ['x_opencti_main_observable_type'],
        mode: 'and',
        operator: 'eq',
        values: ['IPv4']
      };
      expect(testers.testMainObservableType(stixWithMOT, filter)).toEqual(false);
      expect(testers.testMainObservableType(stixWithoutMOT, filter)).toEqual(false);
    });
  });

  describe('by Object contains (key=objectContains)', () => {
    const stixWithObjectRefs = stixReports[0];
    const stixWithoutObjectRefs = stixIncidents[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['objectContains'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', 'incident--572ee294-04a6-548f-a091-a4502a44c342']
      };
      expect(testers.testObjectContains(stixWithObjectRefs, filter)).toEqual(true);
      expect(testers.testObjectContains(stixWithoutObjectRefs, filter)).toEqual(false);

      filter = {
        key: ['objectContains'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>']
      };
      expect(testers.testObjectContains(stixWithObjectRefs, filter)).toEqual(false);
      expect(testers.testObjectContains(stixWithoutObjectRefs, filter)).toEqual(false);
    });
  });

  describe('by Severity (key=severity)', () => {
    const stixWithSeverity = stixIncidents[0];
    const stixWithoutSeverity = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['severity'],
        mode: 'or',
        operator: 'eq',
        values: ['medium']
      };
      expect(testers.testSeverity(stixWithSeverity, filter)).toEqual(true);
      expect(testers.testSeverity(stixWithoutSeverity, filter)).toEqual(false);

      filter = {
        key: ['severity'],
        mode: 'and',
        operator: 'eq',
        values: ['low']
      };
      expect(testers.testSeverity(stixWithSeverity, filter)).toEqual(false);
      expect(testers.testSeverity(stixWithoutSeverity, filter)).toEqual(false);
    });
  });

  describe('by Priority (key=priority)', () => {
    const stixWithPriority = stixRfis[0];
    const stixWithoutPriority = stixReports[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['priority'],
        mode: 'or',
        operator: 'eq',
        values: ['p3', 'p4']
      };
      expect(testers.testPriority(stixWithPriority, filter)).toEqual(true);
      expect(testers.testPriority(stixWithoutPriority, filter)).toEqual(false);

      filter = {
        key: ['priority'],
        mode: 'and',
        operator: 'lt',
        values: ['p3']
      };
      expect(testers.testPriority(stixWithPriority, filter)).toEqual(false);
      expect(testers.testPriority(stixWithoutPriority, filter)).toEqual(false);
    });
  });

  describe('for Relationship', () => {
    const stixRelationship = stixRelationships[0];

    describe('by Relation from (key=fromId)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['fromId'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'threat-actor--fd6b0e6f-96e0-568d-ba24-8a140d0428cd']
        };
        expect(testers.testRelationFrom(stixRelationship, filter)).toEqual(true);

        filter = {
          key: ['fromId'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationFrom(stixRelationship, filter)).toEqual(false);
      });
    });

    describe('by Relation to (key=toId)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['toId'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'grouping--e09ce86e-0bd0-5a09-a5e9-4ebd76b79bd4']
        };
        expect(testers.testRelationTo(stixRelationship, filter)).toEqual(true);

        filter = {
          key: ['toId'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationTo(stixRelationship, filter)).toEqual(false);
      });
    });

    describe('by From Types (key=fromTypes)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['fromTypes'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'Threat-Actor-Group']
        };
        expect(testers.testRelationFromTypes(stixRelationship, filter)).toEqual(true);

        filter = {
          key: ['fromTypes'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationFromTypes(stixRelationship, filter)).toEqual(false);
      });
    });

    describe('by To Types (key=toTypes)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['toTypes'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'Grouping']
        };
        expect(testers.testRelationToTypes(stixRelationship, filter)).toEqual(true);

        filter = {
          key: ['toTypes'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationToTypes(stixRelationship, filter)).toEqual(false);
      });
    });
  });

  describe('for Sighting', () => {
    const stixSighting = stixSightings[0];

    describe('by Relation from (key=fromId)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['fromId'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'indicator--4099edd7-1efd-54aa-9736-7bcd7219b78b']
        };
        expect(testers.testRelationFrom(stixSighting, filter)).toEqual(true);

        filter = {
          key: ['fromId'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationFrom(stixSighting, filter)).toEqual(false);
      });
    });

    describe('by Relation to (key=toId)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['toId'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'location--b8d0549f-de06-5ebd-a6e9-d31a581dba5d']
        };
        expect(testers.testRelationTo(stixSighting, filter)).toEqual(true);

        filter = {
          key: ['toId'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationTo(stixSighting, filter)).toEqual(false);
      });
    });

    describe('by "From Types" (key=fromTypes)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['fromTypes'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'Indicator']
        };
        expect(testers.testRelationFromTypes(stixSighting, filter)).toEqual(true);

        filter = {
          key: ['fromTypes'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationFromTypes(stixSighting, filter)).toEqual(false);
      });
    });

    describe('by "To Types" (key=toTypes)', () => {
      it('should test positive for a stix object with matching filter', () => {
        let filter: Filter = {
          key: ['toTypes'],
          mode: 'or',
          operator: 'eq',
          values: ['<some-id>', 'Country']
        };
        expect(testers.testRelationToTypes(stixSighting, filter)).toEqual(true);

        filter = {
          key: ['toTypes'],
          mode: 'and',
          operator: 'eq',
          values: ['<some-id>']
        };
        expect(testers.testRelationToTypes(stixSighting, filter)).toEqual(false);
      });
    });
  });

  describe('by "Connected to" (key=connectedToId)', () => {
    const stixRelationship = stixRelationships[0];
    const stixSighting = stixSightings[0];

    it('should test positive for a stix object with matching filter', () => {
      let filter: Filter = {
        key: ['connectedToId'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', 'threat-actor--fd6b0e6f-96e0-568d-ba24-8a140d0428cd']
      };
      expect(testers.testConnectedTo(stixRelationship, filter)).toEqual(true);

      filter = {
        key: ['connectedToId'],
        mode: 'or',
        operator: 'eq',
        values: ['<some-id>', 'location--b8d0549f-de06-5ebd-a6e9-d31a581dba5d']
      };
      expect(testers.testConnectedTo(stixSighting, filter)).toEqual(true);

      filter = {
        key: ['connectedToId'],
        mode: 'and',
        operator: 'eq',
        values: ['<some-id>']
      };
      expect(testers.testConnectedTo(stixRelationship, filter)).toEqual(false);
      expect(testers.testConnectedTo(stixSighting, filter)).toEqual(false);
    });
  });
});
