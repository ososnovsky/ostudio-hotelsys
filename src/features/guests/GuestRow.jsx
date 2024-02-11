import styled from "styled-components";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { useCreateGuest } from "./useCreateGuest";
import { useDeleteGuest } from "./useDeleteGuest";
import CreateGuestForm from "./CreateGuestForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";
import Modal from "../../ui/Modal";
import { Flag } from "../../ui/Flag";

const Guest = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const ID = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Nationality = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

function GuestRow({ guest }) {
  const { isDeleting, deleteGuest } = useDeleteGuest();
  const { isCreating, createGuest } = useCreateGuest();

  const { id: guestId, fullName, email, nationalID, nationality, countryFlag } = guest;

  function handleDuplicate() {
    createGuest({
      fullName: `Copy of ${fullName}`, email, nationalID, nationality,
    })
  }

  return (
    <Table.Row>
      <Flag src={countryFlag} alt={nationality} />
      <Guest>{fullName}</Guest>
      <div>{email}</div>
      <ID>{nationalID}</ID>
      <Nationality>{nationality}</Nationality>
      <div>

        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={guestId} />

            <Menus.List id={guestId}>
              <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate} disabled={isCreating}>Duplicate</Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens='delete'>
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateGuestForm guestToEdit={guest} />
            </Modal.Window>

            <Modal.Window name='delete'>
              <ConfirmDelete resourceName='guests' disabled={isDeleting} onConfirm={() => deleteGuest(guestId)} />
            </Modal.Window>

          </Menus.Menu>
        </Modal>

      </div>
    </Table.Row >
  );
}

export default GuestRow
