import { observer } from "mobx-react-lite";
import { useStore } from "../../stores/store";
import { Button, Modal } from "semantic-ui-react";

export default observer (function ModalContainer() {
    const {modalStore} = useStore();
    return (
        <Modal open={modalStore.modal.open} onClose={modalStore.closeModal} size='mini' closeOnDimmerClick={false} >
            <Modal.Content>
                {modalStore.modal.body}
                <Button negative content='Close' fluid onClick={modalStore.closeModal} style={{marginTop:10}} />
            </Modal.Content>
        </Modal>
    );
})