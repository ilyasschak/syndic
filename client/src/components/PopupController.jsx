'use client';

import { Modal } from 'flowbite-react';

export default function PopupController({showModal, closeModal, bodyContent, headerContent, footerContent}) {
  return (
    <>
      <Modal show={showModal} size={'3xl'} onClose={closeModal}>
        <Modal.Header>{headerContent}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          { bodyContent }
          </div>
        </Modal.Body>
        {footerContent !== "" &&
          <Modal.Footer>
            <div className="space-y-6 w-full">
            { footerContent }
            </div>
          </Modal.Footer>
        }
      </Modal>
    </>
  );
}