import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../utils/Store';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import useStyles from '../utils/styles';
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  TextField,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';

export default function Payment() {
  const {
    // handleSubmit,
    // setValue,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const classes = useStyles();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('');
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, [router, shippingAddress.address]);
  const submitHandler = (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  // const submitHandler = ({ fullName, address, city, postalCode, country }) => {
  //   dispatch({
  //     type: 'SAVE_SHIPPING_ADDRESS',
  //     payload: { fullName, address, city, postalCode, country, location },
  //   });
  //   Cookies.set('shippingAddress', {
  //     fullName,
  //     address,
  //     city,
  //     postalCode,
  //     country,
  //     location,
  //   });
  //   router.push('/payment');
  // };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="Bkash"
                  value="Bkash"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Nagod"
                  value="Nagod"
                  control={<Radio />}
                ></FormControlLabel>
                <FormControlLabel
                  label="Rocket"
                  value="Rocket"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Controller
              name="number"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="number"
                  label="Number"
                  error={Boolean(errors.number)}
                  helperText={
                    errors.number
                      ? errors.number.type === 'minLength'
                        ? 'number length is more than 1'
                        : 'number is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="transactionId"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="transactionId"
                  label="Transaction ID"
                  error={Boolean(errors.transactionId)}
                  helperText={
                    errors.transactionId
                      ? errors.transactionId.type === 'minLength'
                        ? 'transactionId length is more than 1'
                        : 'transactionId is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
