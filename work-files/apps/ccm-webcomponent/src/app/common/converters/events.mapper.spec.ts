import { ItemEvent } from '../../firm-request/item-actions-update/item-actions-activities/item-activity.model';
import { eventsMapper } from './events.mapper';

describe('eventsMapper', () => {
  it('should return empty array if events is undefined', () => {
    const events = undefined;
    const result = eventsMapper(events);
    expect(result).toEqual([]);
  });
  it('should return empty array if events is empty', () => {
    const events = [] as ItemEvent[];
    const result = eventsMapper(events);
    expect(result).toEqual([]);
  });

  it('should return array of ItemEventViewModel', () => {
    const events = [
      {
        user: {
          identityProvider: 'identityProvider',
          firstName: 'firstName',
          lastName: 'lastName',
          orgId: 79,
        },
        dueDate: 'dueDate',
        userName: 'userName',
        action: 'action',
        formattedComments: 'formattedComments',
        documents: [
          {
            attachmentUrl: 'attachmentUrl',
            filename: 'filename',
            fileSize: 100,
          },
        ],
        createDate: 'createDate',
      } as ItemEvent,
    ] as ItemEvent[];
    const result = eventsMapper(events);
    expect(result).toEqual([
      {
        identityProvider: 'identityProvider',
        fullName: 'firstName lastName',
        isExternalUser: false,
        userName: 'userName',
        targetId: 79,
        action: 'action',
        formattedComments: 'formattedComments',
        documents: [
          {
            attachmentUrl: 'attachmentUrl',
            filename: 'filename',
            fileSize: 100,
          },
        ],
        createDate: 'createDate',
        dueDate: 'dueDate',
      },
    ]);
  });
});
