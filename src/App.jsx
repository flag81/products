import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { use } from 'react';

function App() {
  const [count, setCount] = useState(0);

  console.log("starting...");

  const [mediaFiles, setMediaFiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(''); // State for copy success message
  
  const [status, setStatus] = useState('');
  const [folderName, setFolderName] = useState('uploads'); // Folder name input
  const [insertStatus, setInsertStatus] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');

  const [stores, setStores] = useState([]);
const [users, setUsers] = useState([]);

  const CLOUD_NAME = 'dt7a4yl1x';
  const API_KEY = '443112686625846';
  const API_SECRET = 'e9Hv5bsd2ECD17IQVOZGKuPmOA4';


  const imageBaseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

  // NEW: State to track selected public_id values
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedProduct , setSelectedProduct] = useState('');
  const [selectedProductDescription , setSelectedProductDescription] = useState('');


  const prompt = 

  'Can you extract product sale information in albanian language from this sales flyer in the format for each product' +
' Convert ë letter to e for all the keywords. Do not include conjunctions, articles words in Albanian language, in keywords.\n' +
 ' Do not include size info for keywords and only words with more than 2 characters as keywords, \n' + 
  ' The userId is:{userId}. \n' +
  ' The storeId is:{storeId}. \n' +
 
  'The response should be in the format for each product as object in an array of objects: \n' +
  `[

    {
      "product_description": "",
      "old_price": "",
      "new_price": "",
      "discount_percentage": "",
      "sale_end_date": "YYYY-MM-DD",
      "storeId": 1,
      "userId": 1,
      "image_url": {imageUrl},
      "keywords": ["kerpudhe"]
}]` +
' Replace the placeholder data in the example with extracted and given data. \n' +
 '  '  ;


 //change

 useEffect(() => {

  getStores();
  getUsers();

 // storeId = document.querySelector('select[name="store"]').value;
  //getAllProducts();
}, []);


const getUsers = async () => {
  try {

    const response = await fetch('http://localhost:3000/getUsers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {

      setUsers(result);
      console.log('users result:', result);
    } else {
      console.error('Failed to fetch users:', result.message);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};



  const getStores = async () => {
    try {
      const response = await fetch('http://localhost:3000/getStores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setStores(result);
        console.log('stores result:', result);
      } else {
        console.error('Failed to fetch stores:', result.message);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  // create a new function to add a product to favorites with user id and product id

  const addProductToFavorites = async (userId, productId) => {

    try {
      const response = await fetch('http://localhost:3000/addFavorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('result:', result);
        getAllProducts(userId);
      }
    }
    catch (error) {
      console.error('Error adding product to favorites:', error);
    }
  };

// create a new function to remove a product from favorites with user id and product id

const removeProductFromFavorites = async (userId, productId) => {

  try {
    const response = await fetch('http://localhost:3000/removeFavorite', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });

    const result = await response.json();

    if (response.ok) {

      console.log('result:', result);
      getAllProducts(userId);
    }
  }
  catch (error) {
    console.error('Error removing product from favorites:', error);
  }
};

// add function to edit the product description for a product with product id and new description

const editProductDescription = async (productId, newDescription) => {
  try {
    const response = await fetch('http://localhost:3000/editProductDescription', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, newDescription }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('result:', result);
      getAllProducts();
    }
  }
  catch (error) {
    console.error('Error editing product description:', error);
  }
};


  const searchProducts = async (keyword) => {
    try {
      const response = await fetch(`http://localhost:3000/searchProducts?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setProducts(result);
        console.log('result:', result);
      } else {
        console.error('Failed to fetch products:', result.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  //change getAllProducts to include a keyword sent to the server to filter products


  const getAllProducts = async (userId, storeId, isFavorite, onSale) => {
    try {

      console.log('getAllProducts userId:', userId);
      console.log('getAllProducts storeId:', storeId);
      console.log('getAllProducts isFavorite:', isFavorite);
      console.log('getAllProducts onSale:', onSale);

      
      const response = await fetch(`http://localhost:3000/getProducts?userId=${encodeURIComponent(userId)}
      &storeId=${encodeURIComponent(storeId)}
      &isFavorite=${encodeURIComponent(isFavorite)}&onSale=${encodeURIComponent(onSale)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });

      const result = await response.json();

      if (response.ok) {
        setProducts(result);
        console.log('result:', result);
      } else {
        console.error('Failed to fetch prod:', result.message);
      }
    } catch (error) {
      console.error('Error fetching prod:', error);
    }
  };
  

  // Fetch media files from Cloudinary
  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('https://qg048c0c0wos4o40gos4k0kc.128.140.43.244.sslip.io/media-library-json');
      if (!response.ok) {
        throw new Error('Failed to fetch media files');
      }
      const data = await response.json();
      console.log('media files data:', data);
      if (Array.isArray(data)) {
        setMediaFiles(data);
      } else {
        setError('Unexpected data format');
      }
      setLoading(false);
    } catch (err) {
      setError(`Error fetching media files: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  useEffect(() => {
    console.log('error change:', error);
  }, [error]);

  // Handle image upload
  const handleImageUpload = async (event) => {
    event.preventDefault();
    const fileInput = event.target.elements.image;
    const file = fileInput.files[0];

    console.log('file:', file);

    if (!file) {
      setStatus('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('folderName', folderName); // Send folder name in request

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus(`Image uploaded successfully! URL: ${result.url}`);
        setMediaFiles((prevFiles) => [...prevFiles, result]); // Add new image to mediaFiles
        fetchMediaFiles(); // Fetch media files again to include the new image
      } else {
        setStatus(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setStatus('An error occurred while uploading the image.');
      console.error('Error:', error);
    }
  };

  // NEW: Handle checkbox change
  const handleCheckboxChange = (public_id) => {


    setSelectedImages((prevSelected) => {
      if (prevSelected.includes(public_id)) {
        return prevSelected.filter(id => id !== public_id);
      } else {
        return [...prevSelected, public_id];
      }
    });
  };

  const handleDeleteImage = async (public_id) => {
    try {
      const response = await fetch('http://localhost:3000/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove deleted image from the state
        setMediaFiles((prevFiles) => prevFiles.filter((file) => file.public_id !== public_id));
        setStatus('Image deleted successfully');
      } else {
        setStatus(`Failed to delete image: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting image:', error.message);
      setStatus('An error occurred while deleting the image.');
    }
  };

  // NEW: Copy the list of selected public_id values to the clipboard
  const copySelectedImages = () => {
    const selectedIdsString = selectedImages.join(', ');
    navigator.clipboard.writeText(selectedIdsString).then(
      () => {
        setStatus('Copied selected image IDs to clipboard!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      },
      () => {
        setStatus('Failed to copy');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      }
    );
  };


    // NEW: Copy the list of selected public_id values to the clipboard
    const copyPrompt = () => {
      const selectedIdsString = selectedImages.join(', ');
  
      // GET THE CONTENT OF THE TEXTAREA AND COPY IT TO THE CLIPBOARD

      // replace {storeId} text with the value of the store select element and {userId} with the value of the user select element in the promt variable 
      // and then copy the prompt and the selectedIdsString to the clipboard

      const storeId = document.querySelector('select[name="store"]').value;
      const userId = document.querySelector('select[name="user"]').value;

      const imageUrl = document.getElementById('selectedImages').value;

      if(imageUrl === '') {
        setStatus('Please select an image.');
        return;
      }

      let modifiedPrompt = prompt.replace('{storeId}', storeId).replace('{userId}', userId).replace('{imageUrl}', imageUrl);

       

  
      navigator.clipboard.writeText(modifiedPrompt + selectedIdsString).then(
  
        () => {
          setStatus('Copied selected image IDs to clipboard!');
          setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
        },
        () => {
          setStatus('Failed to copy');
          setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
        }
      );
    };


// add a new function to call the server api addKeyword to add a keyword to a product

const addKeyword = async (productId, keyword) => {
  try {
    const response = await fetch('http://localhost:3000/addKeyword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, keyword }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('result:', result);
      getAllProducts();
    }
  }
  catch (error) {
    console.error('Error adding keyword:', error);
  }
};

// add a new function to call the server api removeKeyword to remove a keyword from a product

const removeKeyword = async (productId, keyword) => {
  try {
    const response = await fetch('http://localhost:3000/removeKeyword', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, keyword }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('result:', result);
      getAllProducts();
    }
  }
  catch (error) {
    console.error('Error removing keyword:', error);
  }
};




    // call server api   app.get('/chatgptExtractProducts', async (req, res) => {
    
    //  const { storeId, imageUrl } = req.query;
  // to get the data extrcted from image

  // Handle product extraction
  const extractProducts = async (storeId, imageUrl) => {
    try {


      console.log('extractProducts storeId:', storeId);
      console.log('extractProducts imageUrl:', imageUrl);


      const response = await fetch(`http://localhost:3000/chatgptExtractProducts?storeId=${storeId}&imageUrl=${imageUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        //setProducts(result);
        document.getElementById('products').value = JSON.stringify(result, null, 2);
        console.log('result:', result);
      } else {
        console.error('Failed to extract products:', result.message);
      }
    } catch (error) {
      console.error('Error extracting products:', error);
    }

  };


    // Handle product insertion
    const insertProducts = async () => {
      const textarea = document.getElementById('products');
      const productData = textarea.value;

      const storeId = document.querySelector('select[name="store"]').value;


      //if storetId is not selected then show error message and return from the function

      if (!storeId || storeId === '0') {
        setStatus('Please select a store.');
        return;
      }

      console.log('productData sent:', productData);
  
      if (!productData) {
        setStatus('Please enter product data.');
        return;
      }

      let parsedProductData;
  
      try {
        // Parse the product data to ensure it's a valid JSON array
        parsedProductData = JSON.parse(productData);
        
        // Check if parsed data is an array of objects
        if (!Array.isArray(parsedProductData)) {
          setStatus('Product data should be an array of products.');
          return;
        }
      } catch (error) {
        setStatus('Invalid product data. Please enter valid JSON.');
        console.error('Parsing error:', error);
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/insertProducts1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          //body: JSON.stringify({ products: productData }),

          // make body an array of objects
           body: JSON.stringify(parsedProductData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setStatus('Products inserted successfully!');
        } else {
          setStatus(`Failed to insert products: ${result.error}`);
        }
      } catch (error) {
        setStatus('An error occurred while inserting products.');
        console.error('Error:', error);
      }
    };

    const handleDeleteProduct = async (productId) => {
      try {

        console.log('productId sent delete:', productId);
        const response = await fetch(`http://localhost:3000/deleteProduct/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.productId !== productId)
          );
          setStatus(`Product with ID ${productId} deleted successfully.`);
          console.log(`Product with ID ${productId} deleted successfully.`);
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };
  

  // If loading or error occurs
  if (loading) {
    return <div>Loading media files...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const clearImageDiv = () => {
    document.getElementById('prod_image ').innerHTML = '';
  };

  return (
    <div style={{ margin: '0', padding: '0', width: '90vw' }}>
      <div style={{ display: 'flex', flexDirection: 'row',  flexWrap: 'wrap', gap: '10px' , width: '100vw' }}>
        <div>
          <h2>Upload Image </h2>
          <form onSubmit={handleImageUpload}>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              required
            />
            <br />
            <input type="file" name="image" accept="image/*" required />
            <br />
            <button type="submit">Upload</button>
          </form>
        
        </div>

        <div>
          <h2>Selected Image IDs</h2>
          <textarea id = "selectedImages"
            value={selectedImages.join(', ')}
            rows="4"
            cols="30"
          />
          <br />
          <button onClick={copySelectedImages}>Copy Selected IDs</button>
          <button onClick={() => document.getElementById('selectedImages').value = ''}>Clear</button>
          <p>{copySuccess}</p>
        </div>

        <div>
          <h2>Prompt</h2>
          <textarea id="prompt"
            value={prompt}   
            rows="4"
            cols="30"
          />
          <br />
          <button onClick={copyPrompt}>Copy prompt</button>
          <button onClick={() => document.getElementById('prompt').value = ''}>Clear</button>

          <p>{copySuccess}</p>
        </div>

        <div>
          <h2>Insert Products</h2>
          <textarea id="products" name="products" rows="10" cols="50" />
          <br />
          <button onClick={insertProducts}>Insert Products</button>


          <button onClick={() => document.getElementById('products').value = ''}>Clear</button>

          <p>{insertStatus}</p>
        </div>

        

</div>


<div>
<p>{status}</p>
  </div>




<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
  
  <select name='store'>
    {stores.map(store => (
      <option value={store.storeId}>{store.storeName}</option>
    ))}

  </select>

  <select name='user'>
    {users.map(user => (
      <option value={user.userId}>{user.userName}</option>
    ))}

  </select>


  Favorite:<input type="checkbox" id="favorites" name="favorites" />

  On Sale:<input type="checkbox" id="onSale" name="onSale" />

<button onClick={() => extractProducts(document.querySelector('select[name="store"]').value, document.getElementById('selectedImages').value)}>Extract Products</button>


  <input type="text" id="keyword" name="keyword" />
  <button onClick={() => addKeyword(selectedProduct, document.getElementById('keyword').value)}>Add Keyword to {selectedProduct}</button>
  <button onClick={() => removeKeyword(selectedProduct, document.getElementById('keyword').value)}>Remove Keyword from {selectedProduct}</button>
  <button onClick={() => editProductDescription(selectedProduct, document.getElementById('keyword').value)}>Edit description for {selectedProduct}</button>



</div>

{/* add a div withe input and button to add a keyword to a product */}

<pre>{}</pre>



<div>









<h2>Search Products</h2>
<input type="text" id="keyword" name="keyword" onKeyDown={(e) => { if (e.key === 'Enter') searchProducts(e.target.value); }} />
<button onClick={() => searchProducts(document.getElementById('keyword').value)}>Search</button>
<button onClick={()=>getAllProducts(document.querySelector('select[name="user"]').value , document.querySelector('select[name="store"]').value, document.getElementById('favorites').checked, document.getElementById('onSale').checked ) }>Get Products</button>
          
</div>


<div style={{ display: 'flex',flexDirection: 'row', gap: '10px', borderColor : "black", borderWidth: 1, width: '100%' }}>



          
      <div className='scrollable-div' style={{ flexGrow:1, width: '100vw' }}>

            <table name="products" border="1" cellPadding="10" cellSpacing="0" borderColor="black">
            {products.map(product => (
              <tr>
                {/* //add  td with checkbox with productId value , when check is set to selectedProduct */}

                <td><input type="checkbox" checked={selectedProduct === product.productId} onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProduct(product.productId);
                    document.getElementById('keyword').value = product.product_description;
                  } else {
                    setSelectedProduct('');
                    document.getElementById('keyword').value = '';
                  }
                }} /></td>

                


              <td>{product.productId}</td>
                <td>{product.product_description}</td> 
                  <td>       <img
                  src={`https://res.cloudinary.com/dt7a4yl1x/image/upload/c_thumb,w_100/uploads/${product.image_url}`}
                  onClick={() => {
                    
                    document.getElementById('prod_image').innerHTML = `<img id="largeImage" src="https://res.cloudinary.com/dt7a4yl1x/image/upload/c_thumb,w_600/uploads/${product.image_url}" />`;
                    
                  }}

                  onDoubleClick={() => {
                    
                    document.getElementById('prod_image').innerHTML = '';
                  }
                }
                 
                />
                <br /> {product.sale_end_date}
                </td>

                <td>{product.keywords.split(',').map(keyword => (
                  <div>{keyword}</div>
                ))}</td>




             

                <td><input type="checkbox" checked={product.isFavorite} onChange={(e) => {

                  const userId = document.querySelector('select[name="user"]').value;

                  console.log('userId:', userId);

                  if (e.target.checked) {

                    // get the user id from the select element with name user

                    addProductToFavorites(userId, product.productId);
                  } else {
                    removeProductFromFavorites(userId, product.productId);
                  }
                }
                } /></td>


                <td><button onClick={() => handleDeleteProduct(product.productId)}>Delete</button></td>
              
              </tr>
            ))}
          </table></div>
          
        

          <div id="prod_image" />

      <div className='scrollable-div2' style={{  width: '100%'}}> 


        

      <table name = "media" border="1" cellPadding="10" cellSpacing="0" >

        <tbody>
          {mediaFiles.map((file) => (
            <tr key={file.public_id}>
              <td style={{width:"30"}}>

                <img
                  src={`https://res.cloudinary.com/dt7a4yl1x/image/upload/c_thumb,w_100/${file.public_id}.${file.format}`}
                  alt={file.public_id}  onClick={() => {
                    document.getElementById('selectedImages').value = file.public_id;
                    document.getElementById('prod_image').innerHTML = `<img id="largeImage" src="https://res.cloudinary.com/dt7a4yl1x/image/upload/c_thumb,w_600/${file.public_id}.${file.format}" />`;
                    
                  }}

                  onDoubleClick={() => {
                    document.getElementById('selectedImages').value = file.public_id;
                    document.getElementById('prod_image').innerHTML = '';
                  }
                  }

                />

        



      
              </td>
              <td style={{fontSize:10, width: "20%"}}>{file.public_id}.{file.format}</td>

              <td style={{width:"15%"}}>
                <button onClick={() => handleDeleteImage(file.public_id)}>Delete</button>
              </td>
              <td style={{width:"5%"}}> {/* NEW: Checkbox for selecting images */}
              
                <input
                  type="checkbox"
                  onChange={() => handleCheckboxChange(file.public_id.split('/').pop() + '.'+ file.format)}
                  checked={selectedImages.includes(file.public_id.split('/').pop() + '.'+ file.format)}
                />
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
      
      </div>
          <br />

          
       




  </div> 





    </div>
  );
}

export default App;
