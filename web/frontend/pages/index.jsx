import { useState, useMemo, useCallback } from "react";
import { Toast, Frame, Button, DataTable, Card, Heading, Page, Stack, TextField, EmptyState } from "@shopify/polaris";
import { ResourcePicker } from '@shopify/app-bridge-react';

export default function HomePage() {
  const [newPrice, setNewPrice] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const productData = useMemo(() => products.map((product) => [
    product.id,
    product.title,
    `${product.variants[0].price}¥`,
    `${newPrice}¥`
  ]), [products, newPrice]);

  const submitHandler = useCallback(() => {
    console.log('submitting')
    setShowToast(true)
  }, []);

  const toastMarkup = showToast ? 
    <Toast 
      content="Update Successful"
      onDismiss={() => setShowToast(false)}
      duration={4000}
    /> : null;

  return (
    <Frame>
      <Page>
        <Heading>Product Price Update</Heading>
        <Card>
          <Card.Section>
            <Stack vertical>
              <Button primary onClick={() => setPickerOpen(true)}>Select Product</Button>
              <ResourcePicker
                resourceType="Product"
                open={pickerOpen}
                selectMultiple={false}
                onCancel={() => setPickerOpen(false)}
                onSelection={(resources) => {
                  setPickerOpen(false)
                  console.log(resources.selection)
                  setProducts(resources.selection)
                }}
              />
              <TextField
                label="New price"
                value={newPrice}
                onChange={setNewPrice}
              />
            </Stack>
          </Card.Section>
          <Card.Section>
            { productData.length ? <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['ID', 'Title', 'Old price', 'New price']}
              rows={productData}
            /> : <EmptyState heading="No Product Selected"/>}
          </Card.Section>
          <Card.Section>
            <Button primary onClick={submitHandler} disabled={!products.length}>Submit</Button>
          </Card.Section>
        </Card>
        {toastMarkup}
      </Page>
    </Frame>
  );
}
