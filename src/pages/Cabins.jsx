// import { useEffect } from "react";
// import { useState } from "react";

import Heading from "../ui/Heading";
import Row from "../ui/Row";
// import { getCabins } from "../services/apiCabins";
import CabinTable from "../features/cabins/CabinTable";
// import Button from "../ui/Button";
// import CreateCabinForm from "../features/cabins/CreateCabinForm";
import AddCabin from "../features/cabins/AddCabin";
import CabinTableOperations from "../features/cabins/CabinTableOperations";

function Cabins() {
  // useEffect(function () {
  //   getCabins().then((data) => console.log(data))
  // }, [])

  // const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <CabinTableOperations />
        {/* <img src="https://tmmklvknxxulcnivesbr.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg" /> */}
      </Row>

      <Row>
        <CabinTable />

        {/* <Button onClick={() => setShowForm(show => !show)}>Add new cabin</Button>
        {showForm && <CreateCabinForm />} */}
        <AddCabin />
      </Row>
    </>
  );
}

export default Cabins;
