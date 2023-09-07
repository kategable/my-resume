import {
  ExternalUserData,
  FirmData,
  InternalUserData,
  RequestContactsData,
  UserGroupData,
} from '../../api/envelope/envelope.api.interface';
import { FirmIndividualType } from '../../firm-request/enums/firm-rep-type';
import { ContactViewModel } from '../../firm-request/models/envelope-view-model';
import { mapList } from './mappers';
import { userDataExternalMapper } from './user-data-external.mapper';
import { internalStaffsMapper } from './internal-staffs.mapper';
import { FIRM_ID_EXTERNAL, FIRM_ID_INTERNAL, REGULATORY_INQUIRIES } from '../constants/envelope.constants';
import { Contacts } from '../../service/config/config.interface';

export const dataRequestContactsMapper = (
  requestManagerId: string | null,
  view: ContactViewModel
): RequestContactsData => {
  const data: RequestContactsData = {
    requestId: requestManagerId ? +requestManagerId : null,
    caseTypeCd: '27',
    caseCategoryName: 'CAUSE',
    //firmIdExternalSelected: this is used for another useCase when firm tagged not selected,
    requiredRoles: [
      {
        id: 27,
        name: REGULATORY_INQUIRIES,
      },
    ],
    firmDataInternal: {} as FirmData,
    lstFirmDataExternal: [
      {
        lstUserGroupDataSelected: [] as UserGroupData[],
      },
    ] as FirmData[],
  };
  if (view.recipientType === FirmIndividualType.FIRM) {
    if (view.selectedFirm && view.selectedContactsForFirm.length > 0) {
      data.lstFirmDataExternal[0].firmId = view.selectedFirm.crdId;
      data.lstFirmDataExternal[0].lstUserGroupDataSelected = [
        { lstUserData: [] as InternalUserData[] | ExternalUserData[] } as UserGroupData,
      ];
      data.lstFirmDataExternal[0].lstUserGroupDataSelected[0].lstUserData = mapList(userDataExternalMapper)(
        view.selectedContactsForFirm
      );
    }
  } else {
    // INDIVIDUAL | INDIVIDUAL_ASSOCIATED
    if (view.selectedContactsForIndividual.length > 0) {
      data.lstFirmDataExternal[0].firmId = FIRM_ID_EXTERNAL;
      data.lstFirmDataExternal[0].lstUserGroupDataSelected = [
        { lstUserData: [] as InternalUserData[] | ExternalUserData[] } as UserGroupData,
      ];
      data.lstFirmDataExternal[0].lstUserGroupDataSelected[0].lstUserData = mapList(userDataExternalMapper)(
        view.selectedContactsForIndividual
      );
      view.selectedIndividuals.forEach((ind: Contacts) => {
        const foundInExternal = data.lstFirmDataExternal[0].lstUserGroupDataSelected[0].lstUserData.find(
          (pp) => pp.email === ind.businessEmail[0]
        );
        if (!foundInExternal) {
          const ll = userDataExternalMapper(ind) as InternalUserData;
          data.lstFirmDataExternal[0].lstUserGroupDataSelected[0].lstUserData.push(ll);
        }
      });
      data.lstFirmDataExternal[0].lstUserGroupDataSelected[0].lstUserData.forEach((pp) => {
        pp.group = null;
      });
    }
  }
  if (view.selectedStaffs.length > 0) {
    data.firmDataInternal.firmId = FIRM_ID_INTERNAL;
    data.firmDataInternal.lstUserGroupDataSelected = [
      { lstUserData: [] as InternalUserData[] | ExternalUserData[] } as UserGroupData,
    ];
    data.firmDataInternal.lstUserGroupDataSelected[0].lstUserData = mapList(internalStaffsMapper)(
      view.selectedStaffs
    ) as InternalUserData[];
  }
  return data;
};

export const userGroupDataExternal = (users: ExternalUserData[]): UserGroupData => {
  return {
    name: REGULATORY_INQUIRIES,
    lstUserData: users,
  } as UserGroupData;
};
