
import { useEffect, useState } from "react";

import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiPackage,
} from "react-icons/fi";

import Swal from "sweetalert2";

import {
  useGetAdminBrandsQuery,
  useDeleteBrandMutation,
} from "../../services/admin/adminBrandApi";

import BrandForm from "../../components/BrandsForm";


const Brands = () => {

  const { data, isLoading } = useGetAdminBrandsQuery();

  const [deleteBrand] = useDeleteBrandMutation();

  const brands = data?.brands || [];


  const [search, setSearch] = useState("");

  const [showDrawer, setShowDrawer] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(null);



  // ESC close drawer
  useEffect(() => {

    const handleEsc = (e) => {

      if(e.key === "Escape"){
        setShowDrawer(false);
      }

    };


    window.addEventListener(
      "keydown",
      handleEsc
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleEsc
      );

    };


  }, []);




  const filteredBrands = brands.filter((brand)=>

    brand.name
      .toLowerCase()
      .includes(search.toLowerCase())

  );




  const handleDelete = async(id)=>{


    const result = await Swal.fire({

      title:"Delete brand?",

      text:"This action cannot be undone!",

      icon:"warning",

      showCancelButton:true,

      confirmButtonText:"Yes, delete",

      cancelButtonText:"Cancel",

      confirmButtonColor:"#dc2626",

      cancelButtonColor:"#64748b",

    });


    if(!result.isConfirmed) return;



    try{

      await deleteBrand(id).unwrap();


      Swal.fire({

        icon:"success",

        title:"Deleted",

        text:"Brand deleted successfully",

        timer:1500,

        showConfirmButton:false,

      });


    }catch(error){


      Swal.fire({

        icon:"error",

        title:"Failed",

        text:error?.data?.message || "Delete failed",

      });


    }


  };




  if(isLoading){

    return (

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {
          [1,2,3,4].map((item)=>(

            <div

              key={item}

              className="
              h-48
              animate-pulse
              rounded-2xl
              bg-gray-200
              "

            />

          ))
        }

      </div>

    );

  }



  return (
    <>
      <section className="space-y-8">
        {/* Header */}

        <div
          className="
          lg:sticky
          pt-10
          lg:pt-5
          top-0
          z-20
          -mx-6
          -mt-6
          mb-8
          border-gray-300
          border-b
          bg-gray-100/95
          px-6
          py-5
          backdrop-blur
          "
        >
          <div
            className="
            flex
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
            "
          >
            <div>
              <h1
                className="
                text-3xl
                font-bold
                text-slate-900
                "
              >
                Brands
              </h1>

              <p className="mt-1 text-gray-500">Manage your product brands</p>
            </div>

            <button
              onClick={() => {
                setSelectedBrand(null);

                setShowDrawer(true);
              }}
              className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-900
              px-6
              py-3
              font-medium
              text-white
              shadow-sm
              transition
              hover:bg-slate-800
              hover:shadow-lg
              active:scale-95
              w-full
              sm:w-fit
              "
            >
              <FiPlus size={18} />
              Add Brand
            </button>
          </div>

          {/* Search */}

          <div
            className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            pt-5
            pb-2
            "
          >
            <div className="relative w-full max-w-lg">
              <FiSearch
                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                py-3
                pl-11
                pr-11
                shadow-sm
                outline-none
                transition
                focus:border-gray-400
                "
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-black
                    "
                >
                  <FiX />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Showing
              <span className="mx-1 font-semibold text-gray-700">
                {filteredBrands.length}
              </span>
              brands
            </p>
          </div>
        </div>

        {/* Cards */}

        {filteredBrands.length === 0 ? (
          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            bg-white
            py-24
            text-center
            border-gray-300
            mt-15
            "
          >
            <div
              className="
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              bg-gray-100
              "
            >
              <FiPackage size={30} className="text-gray-400" />
            </div>

            <h3 className="text-xl font-semibold">No Brands Found</h3>

            <p className="mt-2 text-gray-500">Try searching another brand</p>
          </div>
        ) : (
          <div
            className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            lg:mt-13
            "
          >
            {filteredBrands.map((brand) => (
              <div
                key={brand._id}
                className="
                  group
                  rounded-2xl
                  border
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-300
                  border-gray-300
                  hover:-translate-y-1
                  hover:shadow-xl
                  "
              >
                <div className="space-y-5">
                  <div>
                    <div
                      className="
                        mb-4
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-100
                        text-2xl
                        transition
                        group-hover:scale-110
                        "
                    >
                      🏷️
                    </div>

                    <h2
                      className="
                        text-xl
                        font-semibold
                        capitalize
                        "
                    >
                      {brand.name}
                    </h2>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-gray-500
                        "
                    >
                      Slug :<span className="ml-1">{brand.slug}</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedBrand(brand);

                        setShowDrawer(true);
                      }}
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-blue-500
                        py-3
                        font-medium
                        text-blue-600
                        transition-all
                        duration-300
                        hover:bg-blue-50
                        "
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="
                        flex
                        flex-1
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-500
                        py-3
                        font-medium
                        text-red-600
                        transition-all
                        duration-300
                        hover:bg-red-50
                        "
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Right Drawer */}

      {showDrawer && (
        <div
          className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/40
    backdrop-blur-sm
    px-4
    "
          onClick={() => setShowDrawer(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
      w-full
      max-w-xl
      max-h-[90vh]
      overflow-y-auto
      rounded-2xl
      bg-white
      shadow-2xl
      animate-in
      fade-in
      zoom-in
      duration-300
      "
          >
            {/* Header */}

            <div
              className="
        flex
        items-center
        justify-between
        border-b
        border-gray-300
        px-6
        py-5
        "
            >
              <div>
                <h2
                  className="
            text-2xl
            font-bold
            text-slate-900
            "
                >
                  {selectedBrand ? "Edit Brand" : "Add Brand"}
                </h2>

                <p
                  className="
            mt-1
            text-sm
            text-gray-500
            "
                >
                  {selectedBrand
                    ? "Update brand details"
                    : "Create a new product brand"}
                </p>
              </div>

              <button
                onClick={() => setShowDrawer(false)}
                className="
          rounded-lg
          p-2
          transition
          hover:bg-gray-100
          "
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}

            <div className="p-6">
              <BrandForm
                brand={selectedBrand}
                onClose={() => setShowDrawer(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Brands
    