import { UiStateService } from '../../service/ui-state.service';
import { FirmRequestComponent } from './firm-request.component';
import { of } from 'rxjs';

describe('FirmRequestComponent', () => {
  let component: FirmRequestComponent;
  let uiStateServiceMock: any;

  beforeEach(async () => {
    uiStateServiceMock = jasmine.createSpyObj(UiStateService, [
      'publish',
      'deleteDraft',
      'start',
      'showRedAlert',
      'showGreenAlert',
      'deleteDraft',
    ]);
    uiStateServiceMock.envelopeViewModel$ = of({} as any);
    component = new FirmRequestComponent(uiStateServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onBack', () => {
    component.showBackConfirmation = false;
    component.onBack({
      contactsViewModel: {
        changed: false,
      },
      itemsViewModel: {
        changed: false,
      },
    } as any);
    expect(component.showBackConfirmation).toBeFalsy();
  });

  it('onBack with no changesSaved', () => {
    component.changesSaved = false;
    component.onBack({
      contactsViewModel: {
        changed: true,
      },
      itemsViewModel: {
        changed: false,
      },
    } as any);
    expect(component.showBackConfirmation).toBeTruthy();
  });

  it('onCancelBack', () => {
    component.showBackConfirmation = true;
    component.onCancelBack();
    expect(component.showBackConfirmation).toBeFalsy();
  });

  it('onConfirmBack', () => {
    component.showBackConfirmation = true;
    component.onConfirmBack();
    expect(component.showBackConfirmation).toBeFalsy();
    expect(uiStateServiceMock.start).toHaveBeenCalled();
  });

  it('should toggle confirm delete dialog', () => {
    expect(component.showDeleteConfirmDialog).toBeFalsy();

    component.toggleDeleteConfrimDialog();

    expect(component.showDeleteConfirmDialog).toBeTruthy();
  });

  it('should show confirm dialog on draft delete', () => {
    expect(component.showDeleteConfirmDialog).toBeFalsy();

    component.onDeleteDraft();

    expect(component.showDeleteConfirmDialog).toBeTruthy();
  });

  it('should toggle confirm publish success', () => {
    expect(component.showPublishConfirmDialog).toBeFalsy();
    component.toggleConfirmPublishSuccess();
    expect(component.showPublishConfirmDialog).toBeTruthy();
  });

  it('should set changesSaved to false', () => {
    component.changesSaved = true;
    component.onChange();
    expect(component.changesSaved).toBeFalsy();
  });

  it('should toggle show error', () => {
    component.showError = false;
    component.toggleShowError();
    expect(component.showError).toBeTruthy();
    expect(uiStateServiceMock.showRedAlert).toHaveBeenCalled();
  });

  it('should toggle show success', () => {
    component.showSuccess = false;
    component.toggleShowSuccess('TEST');
    expect(component.showSuccess).toBeTruthy();
    expect(uiStateServiceMock.showGreenAlert).toHaveBeenCalledWith('TEST');
  });

  it('should call delete service on confirm delete', () => {
    uiStateServiceMock.deleteDraft.and.returnValue(
      new Promise((resolve) => resolve({ good: true, message: 'test' } as any))
    );
    component.onConfirmDeleteDraft({} as any);

    expect(component.showDeleteConfirmDialog).toBeTrue();
    expect(uiStateServiceMock.deleteDraft).toHaveBeenCalled();
  });
  it('should set showPublishConfirmDialog to false on onConfirmPublishSuccess', () => {
    component.showPublishConfirmDialog = true;
    component.onConfirmPublishSuccess();
    expect(component.showPublishConfirmDialog).toBeFalsy();
  });

  it('should cancel event on unloadNotification', () => {
    const event = { returnValue: false };
    component.changesSaved = false;
    component.unloadNotification(event);
    expect(event.returnValue).toBeTrue();
  });
  it('should set publish in progress to true on onPublish', async () => {
    uiStateServiceMock.publish.and.returnValue(
      new Promise((resolve) => resolve({ good: true, message: 'test' } as any))
    );
    component.publishInProgress = false;
    await component.onPublish({} as any);
    expect(component.publishInProgress).toBeTrue();
    expect(uiStateServiceMock.publish).toHaveBeenCalled();
  });

  it('should show error on deleteDraft when delete fails', async () => {
    uiStateServiceMock.deleteDraft.and.returnValue(
      new Promise((resolve) => resolve({ good: false, message: 'test' } as any))
    );
    await component.onConfirmDeleteDraft({} as any);
    expect(uiStateServiceMock.deleteDraft).toHaveBeenCalled();
    expect(uiStateServiceMock.showRedAlert).toHaveBeenCalled();
  });
});
