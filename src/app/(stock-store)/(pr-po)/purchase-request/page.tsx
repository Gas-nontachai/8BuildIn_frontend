"use client";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/date-helper"
import { Add, Home, Assignment, Description, Search, ArrowDownward, ArrowUpward, Sort, Clear } from "@mui/icons-material";
import {
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, TablePagination, Button, Breadcrumbs, Typography, Stack, Link, Chip, Box,
  InputAdornment, MenuItem, Menu, ListItemText, Checkbox
} from "@mui/material";

import Loading from "@/app/components/Loading";
import PurchaseRequestAdd from "@/app/components/StockStore/(PR-PO)/PR/Add";
import { usePagination } from "@/context/PaginationContext";
import { useRouter } from 'next/navigation';
import { Employee, PurchaseRequest } from '@/misc/types';
import { usePurchaseRequest, useEmployee } from "@/hooks/hooks";
import { pdf } from '@react-pdf/renderer';
import PR from "@/app/components/StockStore/(PDF)/PR";

const { getPurchaseRequestBy } = usePurchaseRequest();
const { getEmployeeBy } = useEmployee();

const PurchaseRequestPage = () => {
  const router = useRouter();
  const { page, rowsPerPage, onChangePage, onChangeRowsPerPage } = usePagination();
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [employee, setEmployee] = useState<Employee[]>([]);

  const [isDialogAdd, setIsDialogAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState<string>("");

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  const [sort, setSort] = useState<{ name: string; order: "ASC" | "DESC" }>({
    name: "adddate",
    order: "DESC",
  });

  const statusOptions: {
    label: string;
    value: string;
  }[] = [
      { label: "รอดำเนินการ", value: "pending" },
      { label: "อนุมัติแล้ว", value: "approved" },
      { label: "ไม่อนุมัติ", value: "not-approved" },
      { label: "สั่งซื้อสำเร็จ", value: "success" },
    ];

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    statusOptions.map((option) => option.value)
  );

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchData();
  }, [sort, selectedStatuses]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { docs: res } = await getPurchaseRequestBy({
        search: {
          text: search,
          columns: ["pr_id"],
          condition: "LIKE",
        },
        match: {
          pr_status: { $in: selectedStatuses }
        },
        sorter: [{ key: sort.name, order: sort.order }]
      });
      const { docs: res_emp } = await getEmployeeBy({
        match: {
          $in: res.map((item) => item.addby)
        }
      });
      setEmployee(res_emp);
      setPurchaseRequests(res);
    } catch (error) {
      console.log("Error fetching Purchase Request:", error);
    } finally {
      setLoading(false);
    }
  };

  const openPDF = async (prData: PurchaseRequest) => {
    try {
      const blob = await pdf(<PR prData={prData} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const toggleSort = (key: "name" | "order", value: string) => {
    setSort((prevSort) => {
      if (prevSort.name === value) {
        return {
          ...prevSort,
          order: prevSort.order === "ASC" ? "DESC" : "ASC",
        };
      } else {
        return {
          name: value,
          order: "ASC",
        };
      }
    });
  };

  const handleToggle = (value: string) => {
    const currentIndex = selectedStatuses.indexOf(value);
    const newSelected = [...selectedStatuses];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedStatuses(newSelected);
  };
  return (
    <>
      <div className="flex justify-between items-center mb-3" >
        <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ fontSize: '1rem', my: 2 }}>
          <Link underline="hover" href="/">
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'primary.main' }}>
              <Home fontSize="small" />
              <Typography variant="body1" color="primary">หน้าหลัก</Typography>
            </Stack>
          </Link>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Assignment fontSize="small" />
            <Typography variant="body1" color="text.secondary">ใบขอซื้อ</Typography>
          </Stack>
        </Breadcrumbs>
      </div>
      <div className="flex justify-between item-center mb-3">
        <div className="flex gap-2 mb-5">
          {/* Search Field */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="ค้นหารหัสคำขอซื้อ..."
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  onClick={() => fetchData()}
                  className="cursor-pointer"
                >
                  <Search />
                </InputAdornment>
              ),
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchData();
              }
            }}
          />

          {/* Clear Button */}
          {(search || selectedPurchaseRequest) && (
            <button
              className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center"
              onClick={() => {
                setSearch('');
                setSelectedPurchaseRequest('');
              }}
            >
              <Clear />
            </button>
          )}

          {/* Filter Button & Menu */}
          <div className="flex gap-2">
            <Button
              className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center gap-1"
              onClick={(event) => setFilterAnchorEl(event.currentTarget)}
              endIcon={<Sort />}
            >
              Filter
            </Button>

            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => setFilterAnchorEl(null)}
            >
              {statusOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleToggle(option.value)}
                >
                  <Checkbox checked={selectedStatuses.includes(option.value)} />
                  <ListItemText primary={option.label} />
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Sort Button & Menu */}
          <div className="flex gap-2">
            <Button
              className="bg-gray-200 p-2 rounded-md text-sm text-gray-700 flex items-center gap-1"
              onClick={(event) => setSortAnchorEl(event.currentTarget)}
              endIcon={<Sort />}
            >
              Sort
            </Button>

            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={() => setSortAnchorEl(null)}
            >
              <MenuItem onClick={() => toggleSort("name", "adddate")}>
                จัดเรียงตามวันที่
                {sort.name === "adddate" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
              </MenuItem>

              <MenuItem onClick={() => toggleSort("name", "pr_id")}>
                จัดเรียงตามรหัสใบขอซื้อ
                {sort.name === "pr_id" && (sort.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
              </MenuItem>
            </Menu>
          </div>
        </div>
        <Button variant="contained" color="info" size="small" onClick={() => setIsDialogAdd(true)} startIcon={<Add />}>
          เปิดใบขอซื้อ
        </Button>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <TableContainer style={{ minHeight: "24rem" }}>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-200">
                <TableCell>#</TableCell>
                <TableCell align="center">รหัสใบขอซื้อ</TableCell>
                <TableCell align="center">สถานะใบขอซื้อ</TableCell>
                <TableCell align="center">หมายเหตุ</TableCell>
                <TableCell align="center">เพิ่มโดย</TableCell>
                <TableCell align="center">วันที่เพิ่ม</TableCell>
                <TableCell align="center">อัพเดทล่าสุด</TableCell>
                <TableCell align="center">ออกบิล</TableCell>
              </TableRow >
            </TableHead >
            <TableBody>
              {purchaseRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={item.pr_id} hover>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{item.pr_id}</TableCell>
                  <TableCell align="center">
                    {item.pr_status === 'pending' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-orange-500">
                        รอดำเนินการ
                      </span>
                    ) : item.pr_status === 'approved' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-green-600">
                        อนุมัติแล้ว
                      </span>
                    ) : item.pr_status === 'success' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-blue-500">
                        สั่งซื้อสำเร็จ
                      </span>
                    ) : item.pr_status === 'not-approved' ? (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-white bg-red-500">
                        ไม่อนุมัติ
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[13px] font-[400] text-black bg-gray-300">
                        {item.pr_status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell align="center">{item.pr_note}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => router.push(`/profile/detail?id=${item.addby}`)}>
                      {(() => {
                        const emp = employee.find((e) => e.employee_id === item.addby);
                        return emp ? `${emp.employee_firstname} ${emp.employee_lastname}` : "";
                      })()}
                    </Button >
                  </TableCell>
                  <TableCell align="center">{formatDate(item.adddate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell align="center">{formatDate(item.lastupdate, 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <Button
                        size="small"
                        onClick={() => openPDF(item)}
                        color="info"
                        variant="contained"
                        startIcon={<Description />}
                        aria-label="Open PDF"
                        sx={{
                          backgroundColor: "#ef4036",
                          color: "#fff",
                          textTransform: "none",
                          borderRadius: "12px",
                          padding: "3px 4px",
                          transition: "0.3s",
                          "&:hover": {
                            boxShadow: 6,
                            backgroundColor: "#ff2116",
                          }
                        }}
                      >
                        PDF
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table >
        </TableContainer >
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={purchaseRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />

      <PurchaseRequestAdd open={isDialogAdd} onClose={() => setIsDialogAdd(false)} onRefresh={async () => { await fetchData() }} />
    </>
  )
}

export default PurchaseRequestPage