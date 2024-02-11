import TableOperations from "../../ui/TableOperations";
import SortBy from "../../ui/SortBy";

function GuestTableOperations() {
    return (
        <TableOperations>
            <SortBy options={[{ value: 'fullName-asc', label: 'Sort by name (A-Z)' }, { value: 'fullName-desc', label: 'Sort by name (Z-A)' }, { value: 'nationality-asc', label: 'Sort by nationality (A-Z)' }, { value: 'nationality-desc', label: 'Sort by nationality (Z-A)' },]} />
        </TableOperations>
    )
}

export default GuestTableOperations
