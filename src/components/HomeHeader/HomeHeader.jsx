import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  CaretDownOutlined, InfoCircleOutlined, UserSwitchOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { history } from 'App'
import { ROUTES_NAME, USER_LOGIN } from 'constant'
import { SIGN_OUT } from 'redux/types/UserManagerTypes/userManagerTypes'
import { HeaderCP } from './HomeHeaderCSS'
import logo from '../../assets/img/logo1.png'
import userImg from '../../assets/img/user.png'

function HomeHeader() {
  const { userLogin } = useSelector((state) => state.userManageReducer)
  const [showDrop, setShowDrop] = useState(false)
  const dispatch = useDispatch()
  return (
    <HeaderCP
      className="header"
    >
      <header
        className="d-flex"
        style={{
          width: '90%', justifyContent: 'space-between', alignItems: 'center', margin: '0 auto'
        }}
      >
        <NavLink to="/">
          <img src={logo} style={{ width: '50px' }} alt="" />
          {' '}
        </NavLink>
        <nav className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ul className="d-flex m-0">
            <li>
              <NavLink style={{ padding: '20px 30px', textDecoration: 'none' }} to="/home">Home</NavLink>
            </li>
          </ul>

          {userLogin === null ? (
            <div className="d-flex">
              <button
                onClick={() => {
                  history.push(ROUTES_NAME.LOGIN)
                }}
                type="button"
                className="btn btn-danger mr-3"
              >
                SIGN IN

              </button>
            </div>
          ) : (
            <div
              className="d-flex userLogin"
            >
              <div
                className="userLogin__info d-flex"
                style={{
                  color: '#fff', justifyContent: 'center', alignItems: 'center'
                }}
              >
                <span><img style={{ width: '60px', cursor: 'pointer' }} src={userImg} alt="" /></span>
                <span style={{
                  fontWeight: 'bold', fontSize: '1em'
                }}
                >
                  {' '}
                  {userLogin.hoTen || ''}
                </span>
              </div>
              <div className="userLogin__dropdown">
                <div
                  aria-hidden="true"
                  onBlur={() => {
                    setShowDrop(false)
                  }}
                  onClick={() => {
                    setShowDrop(!showDrop)
                  }}
                  className="dropdown__select"
                >
                  {showDrop ? (
                    <CaretDownOutlined
                      style={{ transform: ' rotate(-180deg)' }}
                    />
                  )
                    : <CaretDownOutlined style={{ transform: ' rotate(0deg)' }} />}
                </div>
                {showDrop ? (
                  <div className="dropdown__list">
                    <ul>
                      <li aria-hidden="true" onClick={() => history.push(ROUTES_NAME.INFO)}>
                        <span className="dropdown__list__icon"><InfoCircleOutlined /></span>
                        Thông tin tài khoản
                      </li>
                      <li aria-hidden="true" onClick={() => history.push(ROUTES_NAME.ADMIN)}>
                        <span className="dropdown__list__icon">
                          <UserSwitchOutlined />
                        </span>
                        Admin
                      </li>
                      <li
                        aria-hidden="true"
                        onClick={() => {
                          localStorage.removeItem(USER_LOGIN)
                          dispatch({ type: SIGN_OUT })
                        }}
                      >
                        <span className="dropdown__list__icon">
                          <LogoutOutlined />
                        </span>
                        Đăng xuất
                      </li>
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </nav>
      </header>
    </HeaderCP>

  )
}

export default HomeHeader
