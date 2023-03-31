import React, {
  useEffect, useMemo, useCallback, useState
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ROUTES_NAME, USER_LOGIN } from 'constant'
import { toast } from 'react-toastify'
import { Redirect } from 'react-router'
import { history } from 'App'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import screen from '../../../assets/img/screen.png'
import backGround from '../../../assets/img/background.jpg'
import { bookTicketAction, getTicketRoomAction, selectSeatAction } from '../../../redux/action/bookTicketManageAction'
import { CheckOutDiv } from './checkOutCSS'

const SEATS_TYPE = [
  { code: 'seat', name: 'Ghế trống' },
  { code: 'bookingSeat', name: 'Đang đặt' },
  { code: 'vipSeat', name: 'Ghế Vip' },
  { code: 'bookedSeat', name: 'Ghế đã đặt' }
]

function CheckOut(props) {
  const dispatch = useDispatch()
  const { ticketRoomDetail, seatsSelecting } = useSelector((state) => state.bookTicketManageReducer)
  console.log(ticketRoomDetail)
  let userLogin = {}
  if (localStorage.getItem(USER_LOGIN)) userLogin = JSON.parse(localStorage.getItem(USER_LOGIN))
  const { thongTinPhim, danhSachGhe } = ticketRoomDetail

  useEffect(() => {
    dispatch(getTicketRoomAction(props.match.params.id))
  }, [props.match.params.id, dispatch])

  const onCheckedSeat = useCallback((seat) => {
    dispatch(selectSeatAction(seat))
  }, [dispatch])

  const renderSeats = useMemo(() => danhSachGhe?.map((seat, index) => {
    const renderClassSeat = (chair = {}) => {
      if (chair.selecting) return 'bookingSeat'
      if (chair.daDat) return 'bookedSeat'
      if (chair.loaiGhe === 'Vip') return 'vipSeat'
      return 'seat'
    }
    return (
      <>
        <button
          aria-label="seat"
          disabled={seat.daDat}
          onClick={() => onCheckedSeat(seat)}
          type="button"
          className={renderClassSeat(seat)}
        />
        {(index + 1) % 16 === 0 ? <br /> : ' ' }
      </>
    )
  }), [danhSachGhe, onCheckedSeat])

  const handleBookTicket = () => {
    if (!seatsSelecting.length) {
      toast.error('Vui lòng chọn ghế')
      return
    }
    const value = {
      maLichChieu: props.match.params.id,
      danhSachVe: seatsSelecting
    }
    dispatch(bookTicketAction(value))
  }

  const delayResend = 300
  const [delay, setDelay] = useState(+delayResend)
  const minutes = Math.floor(delay / 60)
  const seconds = Math.floor(delay % 60)
  const MySwal = withReactContent(Swal)

  useEffect(() => {
    const timer = setInterval(() => {
      setDelay(delay - 1)
    }, 1000)

    if (delay === 0) {
      clearInterval(timer)
      MySwal.fire({
        title: 'Thời gian giữ ghế đã hết!',
        text: 'Bạn muốn đặt vé lại?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Đặt vé lại !',
        cancelButtonText: 'Trang chủ',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) return history.go(0)
        return history.push(ROUTES_NAME.HOME)
      })
    }
    return () => {
      clearInterval(timer)
    }
  })

  if (!localStorage.getItem(USER_LOGIN)) {
    alert('bạn k có quyền truy cập trang này')
    return <Redirect to="/" />
  }

  return (
    <CheckOutDiv style={{ backgroundImage: `url(${backGround})` }}>
      <div className="container py-3">
        <div className="row">
          <div className="col-9">
            <div className="info">
              <div className="info__rap" />
              <div className="info__timer">
                <h2 className="timer__title">Thời gian giữ ghế</h2>
                <div className="timer__cowndown">
                  {minutes}
                  :
                  {seconds}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-9">
            <div className="screen">
              <img style={{ width: '100%' }} src={screen} alt="" />
            </div>
            <div style={{ textAlign: 'center', paddingTop: '2em' }}>
              {renderSeats}
            </div>
            <div className="mt-3 flex justify-center">
              {SEATS_TYPE.map((seat) => (
                <div className="w-1/5 flex flex-col items-center">
                  <button aria-label="Seat" type="button" className={`${seat.code} text-center`} />
                  <p className="m-0 mt-1 text-white">{seat.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-3 text-white formBookTicket" style={{ fontSize: '0.8em' }}>
            <h2 style={{
              padding: '1em', textAlign: 'center', borderBottom: '1px dotted #fff', fontSize: '1.5em'
            }}
            >
              {thongTinPhim?.tenPhim}
            </h2>
            <div className="d-flex py-3 infoFilm">
              <span>Địa điểm:</span>
              <span>{thongTinPhim?.diaChi}</span>
            </div>
            <div className="py-3 infoFilm">
              <p> Ngày chiếu:</p>
              <p>
                {' '}
                {thongTinPhim?.ngayChieu}
                {' '}
                -
                {thongTinPhim?.gioChieu}
              </p>
            </div>
            <div className="py-3">{thongTinPhim?.tenRap}</div>
            <div className="d-flex py-3 infoFilm">
              <div style={{ display: 'flex', flexWrap: 'wrap' }} className="w-4/5">
                <span className="text-danger mr-1">Ghế</span>
                {seatsSelecting?.map((seat) => <span className="text-green-500 mr-1">{seat.tenGhe}</span>)}
              </div>
              <div className="col-span-1">
                <span className="text-success">
                  {seatsSelecting.reduce((total, seat) => total + seat.giaVe, 0).toLocaleString('en-US', { style: 'currency', currency: 'VND' })}
                </span>
              </div>
            </div>
            <div className="py-3 infoFilm">
              <p>Email:</p>
              <p>{userLogin.email}</p>
            </div>
            <div className="py-3 infoFilm">
              <p>Phone:</p>
              <p>{userLogin.soDT}</p>
            </div>
            <div className="pt-5">
              <button
                className="btn btn-success w-100"
                type="button"
                onClick={handleBookTicket}
              >
                Book Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </CheckOutDiv>
  )
}

export default CheckOut
