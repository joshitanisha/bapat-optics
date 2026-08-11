import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ProductSearchModal({
    show,
    onHide,
    selectedRow,
    setValue,
    getData,
    setSelectedProduct,
}){
const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
const searchProducts = async (value) => {
  setSearch(value);
if (value.trim().length < 2) {
    setProducts([]);
    return;
}

  const url = `/admin/offline-order/getBarModProduct?model=${value}&p_category_id=${category}`;

  const res = await getData(url);

console.log("SEARCH RESPONSE", res);

if (res.success) {
    if (Array.isArray(res.data)) {
        setProducts(res.data);
    } else if (res.data) {
        setProducts([res.data]);
    } else {
        setProducts([]);
    }
}
};

const handleCategoryChange = async (e) => {
    const value = e.target.value;
    setCategory(value);

    if (search.trim()) {
        const url = `/admin/offline-order/getBarModProduct?model=${encodeURIComponent(
            search
        )}&p_category_id=${value}`;

        const res = await getData(url);

        if (res.success) {
            setProducts(Array.isArray(res.data) ? res.data : res.data ? [res.data] : []);
        } else {
            setProducts([]);
        }
    }
};
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Search Product
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form.Group className="mb-3">
                    <Form.Label>
                        Category
                    </Form.Label>

  <Form.Select
    value={category}
    onChange={handleCategoryChange}
>
    <option value="">Select Category</option>
    <option value="5">Eyeglasses</option>
    <option value="2">Sunglasses</option>
    <option value="1">Lenses</option>
    <option value="3">Contact Lenses</option>
    <option value="4">Accessories</option>
</Form.Select>
                </Form.Group>

                <Form.Group>

                    <Form.Label>
                        Search Product
                    </Form.Label>
<Form.Control
    value={search}
    onChange={(e) => {
        console.log("Typing:", e.target.value);
        searchProducts(e.target.value);
    }}
    placeholder="Search Product..."
/>
<div className="mt-3">

    {products.map((item) => (

        <div
            key={item.id}
            className="product-result"
     onClick={() => {

    setValue(
        `products.${selectedRow}.product_details`,
        item
    );

    setSelectedProduct(item);

    onHide();

}}
        >

  <div>
    <strong>{item.product_name || item.name}</strong>

    <br />

    <small>{item.model}</small>

    <br />

    <small>₹{item.mrp}</small>
</div>         

        </div>

    ))}

</div>
                </Form.Group>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={onHide}
                >
                    Close
                </Button>

            </Modal.Footer>

        </Modal>
    );
}

export default ProductSearchModal;