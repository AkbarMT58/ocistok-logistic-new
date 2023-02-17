import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const PaginationFilter = ({ setPage, page, setLimit, limit, totalPage }) => {
  const [isLocalPagination, setisLocalPagination] = React.useState({
    LocalPage: page,
  });

  const limitChange = (e) => {
    setLimit(e.target.value);
  };

  let comparePage = totalPage ? totalPage : Number(page);

  const handleChangePage = (e) => {
    const { value } = e.target;
    if (value !== '0' && value !== '-') {
      if (Number(value) <= comparePage) {
        setisLocalPagination({
          ...isLocalPagination,
          LocalPage: value,
        });
      } else {
        setisLocalPagination({
          ...isLocalPagination,
          LocalPage: 1,
        });
      }
    }
  };

  React.useEffect(() => {
    if (isLocalPagination?.LocalPage !== page) {
      return setisLocalPagination((prev) => ({
        ...prev,
        LocalPage: page,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const isChangeGlobalPage = () => {
    setPage(Number(isLocalPagination?.LocalPage));
  };

  const disabledPrev = page === 1;
  const disabledNext = page === comparePage || page === totalPage + 1;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex space-x-3  items-center text-sm">
        <div className="line-clamp-1">
          Page :{' '}
          <input
            type="number"
            value={isLocalPagination?.LocalPage}
            onChange={handleChangePage}
            onBlur={isChangeGlobalPage}
            className="w-12 text-center border p-1 border-gray-300 focus:outline-blue rounded-md"
          />{' '}
          / {totalPage ?? page}
        </div>
        <p className="line-clamp-1">Data limit : </p>
        <select
          className="border border-gray-300 p-1 rounded-md focus:outline-blue "
          value={limit}
          onChange={limitChange}>
          <option value={5}>5</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </div>
      <button
        disabled={disabledPrev}
        className={`flex text-sm p-2  text-white rounded-md cursor-pointer ${
          disabledPrev ? ' bg-gray-200' : 'bg-blue-500'
        } `}
        onClick={() => {
          if (page > 1) {
            setPage((prev) => Number(prev) - 1);
            setisLocalPagination({
              ...isLocalPagination,
              page: Number(isLocalPagination?.page) - 1,
            });
          }
        }}>
        <div>
          <ArrowBackIosIcon style={{ fontSize: '12px' }} />
        </div>
        <p>Prev</p>
      </button>
      <button
        disabled={disabledNext}
        className={`flex text-sm p-2  text-white rounded-md cursor-pointer ${
          disabledNext ? ' bg-gray-200' : 'bg-blue-500'
        } `}
        onClick={() => {
          setPage((prev) => Number(prev) + 1);
          setisLocalPagination({
            ...isLocalPagination,
            page: Number(isLocalPagination?.page) + 1,
          });
        }}>
        <p>Next</p>
        <div>
          <ArrowForwardIosIcon
            style={{ fontSize: '12px', marginLeft: '3px', marginRight: '-3px' }}
          />
        </div>
      </button>
    </div>
  );
};

export default PaginationFilter;
